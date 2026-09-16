import { agregarDepto, editarDepto, eliminarDepto } from "../controllers";
export const SocketClientDepto = {
  agregar: "cliente:depto-agregar",
  editar: "cliente:depto-editar",
  eliminar: "cliente:depto-eliminar",
  municipioListener: "cliente:depto-municipio-listener",
};
const SocketServerDepto = {
  agregar: "server:depto-agregar",
  editar: "server:depto-editar",
  eliminar: "server:depto-eliminar",
};

export const deptoSocket = (io) => {
  io.on("connection", async (socket) => {
    socket.on(SocketServerDepto.editar, async (data, callback) => {
      const { error, msg } = await editarDepto(data);

      if (error) {
        callback({ error, msg: msg || "Hubo un error!" });
        return;
      } else {
        callback({ error, msg: "Editado con exito!" });
        io.emit(SocketClientDepto.editar, data);
      }
    });
    socket.on(SocketServerDepto.agregar, async (data, callback) => {
      const { error, item, msg } = await agregarDepto(data);

      if (error) {
        callback({ error, msg: msg || "Hubo un error" });
        return;
      } else {
        callback({ error, msg: "Guardado con exito!" });
        io.emit(SocketClientDepto.agregar, item);
      }
    });
    socket.on(SocketServerDepto.eliminar, async (data, callback) => {
      const { error, msg } = await eliminarDepto(data);
      if (error) {
        callback({ error, msg: msg || "Hubo un error" });
        return;
      } else {
        callback({ error, msg: "Eliminado con exito!" });
        io.emit(SocketClientDepto.eliminar, data);
      }
    });
  });
};
