import {
  agregarDistrito,
  editarDistrito,
  eliminarDistrito,
} from "../controllers";
import { SocketClientDepto } from "./depto";

const SocketClientDistrito = {
  agregar: "cliente:distrito-agregar",
  editar: "cliente:distrito-editar",
  eliminar: "cliente:distrito-eliminar",
};
const SocketServerDistrito = {
  agregar: "server:distrito-agregar",
  editar: "server:distrito-editar",
  eliminar: "server:distrito-eliminar",
};

export const distritoSocket = (io) => {
  io.on("connection", async (socket) => {
    socket.on(SocketServerDistrito.editar, async (data, callback) => {
      const { error, msg } = await editarDistrito(data);

      if (error) {
        callback({ error, msg: msg || "Hubo un error!" });
        return;
      } else {
        callback({ error, msg: "Editado con exito!" });
        io.emit(`${SocketClientDistrito.editar}.${data.depto}`, data);
      }
    });
    socket.on(SocketServerDistrito.agregar, async (data, callback) => {
      const { error, item, msg } = await agregarDistrito(data);

      if (error) {
        callback({ error, msg: msg || "Hubo un error" });
        return;
      } else {
        callback({ error, msg: "Guardado con exito!" });
        io.emit(SocketClientDepto.municipioListener, {
          _id: data.depto,
          tipo: "add",
        });
        io.emit(`${SocketClientDistrito.agregar}.${data.depto}`, item);
      }
    });
    socket.on(SocketServerDistrito.eliminar, async (data, callback) => {
      const { error, msg } = await eliminarDistrito(data);
      if (error) {
        callback({ error, msg: msg || "Hubo un error" });
        return;
      } else {
        callback({ error, msg: "Eliminado con exito!" });
        io.emit(SocketClientDepto.municipioListener, {
          _id: data.depto,
          tipo: "remove",
        });
        io.emit(`${SocketClientDistrito.eliminar}.${data.depto}`, data);
      }
    });
  });
};
