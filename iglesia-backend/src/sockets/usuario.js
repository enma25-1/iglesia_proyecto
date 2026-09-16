import { agregarUsuario, editarUsuario, eliminarUsuario } from "../controllers";
export const SocketClientUsuario = {
  agregar: "cliente:usuario-agregar",
  editar: "cliente:usuario-editar",
  eliminar: "cliente:usuario-eliminar",
};
const SocketServerSucural = {
  agregar: "server:usuario-agregar",
  editar: "server:usuario-editar",
  eliminar: "server:usuario-eliminar",
};

export const usuarioSocket = (io) => {
  io.on("connection", async (socket) => {
    socket.on(SocketServerSucural.editar, async (data, callback) => {
      const { error, msg } = await editarUsuario(data);

      if (error) {
        callback({ error, msg: msg || "Hubo un error!" });
        return;
      } else {
        callback({ error, msg: "Editado con exito!" });
        io.emit(SocketClientUsuario.editar, data.data);
      }
    });
    socket.on(SocketServerSucural.agregar, async (data, callback) => {
      const { error, item, msg } = await agregarUsuario(data);

      if (error) {
        callback({ error, msg: msg || "Hubo un error" });
        return;
      } else {
        callback({ error, msg: "Guardado con exito!" });
        io.emit(SocketClientUsuario.agregar, item);
      }
    });
    socket.on(SocketServerSucural.eliminar, async (data, callback) => {
      const { error, msg } = await eliminarUsuario(data);
      if (error) {
        callback({ error, msg: msg || "Hubo un error" });
        return;
      } else {
        callback({ error, msg: "Eliminado con exito!" });
        io.emit(SocketClientUsuario.eliminar, data);
      }
    });
  });
};
