import {
  agregarMunicipio,
  editarMunicipio,
  eliminarMunicipio,
} from "../controllers";
import { SocketClientDepto } from "./depto";
const SocketClientMunicipio = {
  agregar: "cliente:municipio-agregar",
  editar: "cliente:municipio-editar",
  eliminar: "cliente:municipio-eliminar",
};
const SocketServerMunicipio = {
  agregar: "server:municipio-agregar",
  editar: "server:municipio-editar",
  eliminar: "server:municipio-eliminar",
};

export const municipioSocket = (io) => {
  io.on("connection", async (socket) => {
    socket.on(SocketServerMunicipio.editar, async (data, callback) => {
      const { error, msg } = await editarMunicipio(data);

      if (error) {
        callback({ error, msg: msg || "Hubo un error!" });
        return;
      } else {
        callback({ error, msg: "Editado con exito!" });

        io.emit(`${SocketClientMunicipio.editar}.${data.depto}`, data);
      }
    });
    socket.on(SocketServerMunicipio.agregar, async (data, callback) => {
      const { error, item, msg } = await agregarMunicipio(data);

      if (error) {
        callback({ error, msg: msg || "Hubo un error" });
        return;
      } else {
        callback({ error, msg: "Guardado con exito!" });
        io.emit(SocketClientDepto.municipioListener, {
          _id: data.depto,
          tipo: "add",
        });
        io.emit(`${SocketClientMunicipio.agregar}.${data.depto}`, item);
      }
    });
    socket.on(SocketServerMunicipio.eliminar, async (data, callback) => {
      const { error, msg } = await eliminarMunicipio(data);
      if (error) {
        callback({ error, msg: msg || "Hubo un error" });
        return;
      } else {
        callback({ error, msg: "Eliminado con exito!" });
        io.emit(SocketClientDepto.municipioListener, {
          _id: data.depto,
          tipo: "remove",
        });
        io.emit(`${SocketClientMunicipio.eliminar}.${data.depto}`, data);
      }
    });
  });
};
