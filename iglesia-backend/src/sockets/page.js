import {
  agregarPage,
  editarPage,
  eliminarPage,
} from "../controllers";
export const SocketClientPage = {
  agregar: "cliente:page-agregar",
  editar: "cliente:page-editar",
};
const SocketServerPage = {
  agregar: "server:page-agregar",
  editar: "server:page-editar",
};

export const pageSocket = (io) => {
  io.on("connection", async (socket) => {
    socket.on(SocketServerPage.editar, async (data, callback) => {
      const { error, msg } = await editarPage(data);

      if (error) {
        callback({ error, msg: msg || "Hubo un error!" });
        return;
      } else {
        callback({ error, msg: "Editado con exito!" });
        io.emit(SocketClientPage.editar, data);
      }
    });
    socket.on(SocketServerPage.agregar, async (data, callback) => {
      const { error, item, msg } = await agregarPage(data);
        

      if (error) {
        callback({ error, msg: msg || "Hubo un error" });
        return;
      } else {
        callback({ error, msg: "Guardado con exito!" });
        io.emit(SocketClientPage.agregar, item);
      }
    });
  });
};
