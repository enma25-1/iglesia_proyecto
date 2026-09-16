import { useEffect } from "react";
import { SocketOnUsuario } from "../helpers";
import { useProvideSocket } from "../../../../hooks";
import { UsuarioItem } from "../interfaces";
import { Pagination } from "../../../../interfaces/global";

// Tipos para las funciones de manejo de eventos
type HandleAgregar = (data: UsuarioItem) => void;
type HandleEditar = (data: UsuarioItem) => void;
type HandleEliminar = (data: { _id: string }) => void;

export const useSocketEvents = ({
  setUsuariosData,
  setPagination,
}: {
  setUsuariosData: React.Dispatch<React.SetStateAction<UsuarioItem[]>>;
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>;
}) => {
  const handleAgregar: HandleAgregar = (data) => {
    setPagination((prev) => ({ ...prev, totalDocs: prev.totalDocs + 1 }));
    setUsuariosData((prev) => [{ ...data, crud: { nuevo: true } }, ...prev]);
  };
  const handleEditar: HandleEditar = (data) =>
    setUsuariosData((prev) =>
      prev.map((item) =>
        item._id === data._id ? { ...data, crud: { editado: true } } : item
      )
    );
  const handleEliminar: HandleEliminar = ({ _id }) =>
    setUsuariosData((prev) => prev.filter((item) => item._id !== _id));

  const { socket } = useProvideSocket();
  useEffect(() => {
    socket?.on(SocketOnUsuario.agregar, handleAgregar);
    socket?.on(SocketOnUsuario.editar, handleEditar);
    socket?.on(SocketOnUsuario.eliminar, handleEliminar);

    return () => {
      socket?.off(SocketOnUsuario.agregar, handleAgregar);
      socket?.off(SocketOnUsuario.editar, handleEditar);
      socket?.off(SocketOnUsuario.eliminar, handleEliminar);
    };
  }, [socket, setUsuariosData]);
};
