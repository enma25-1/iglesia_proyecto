import { Dispatch, useEffect } from "react";
import { SocketOnDistrito } from "../helpers";
import { DistritoItem } from "../interfaces";
import { Pagination } from "../../../../../../interfaces/global";
import { useProvideSocket } from "../../../../../../hooks";

type HandleAgregar = (data: DistritoItem) => void;
type HandleEditar = (data: DistritoItem) => void;
type HandleEliminar = (data: { _id: string }) => void;

export const useDistritoSocketEvents = ({
  setDistritosData,
  setPagination,
  depto,
}: {
  setDistritosData: React.Dispatch<React.SetStateAction<DistritoItem[]>>;
  setPagination: Dispatch<React.SetStateAction<Pagination>>;
  depto: string;
}) => {
  const handleAgregar: HandleAgregar = (data) => {
    setPagination((prev) => ({ ...prev, totalDocs: prev.totalDocs + 1 }));
    setDistritosData((prev) => [{ ...data, crud: { nuevo: true } }, ...prev]);
  };
  const handleEditar: HandleEditar = (data) =>
    setDistritosData((prev) =>
      prev.map((item) =>
        item._id === data._id ? { ...data, crud: { editado: true } } : item
      )
    );
  const handleEliminar: HandleEliminar = ({ _id }) => {
    setDistritosData((prev) => prev.filter((item) => item._id !== _id));
    setPagination((prev) => ({ ...prev, totalDocs: prev.totalDocs - 1 }));
  };

  const { socket } = useProvideSocket();
  useEffect(() => {
    socket?.on(`${SocketOnDistrito.agregar}.${depto}`, handleAgregar);
    socket?.on(`${SocketOnDistrito.editar}.${depto}`, handleEditar);
    socket?.on(`${SocketOnDistrito.eliminar}.${depto}`, handleEliminar);

    return () => {
      socket?.off(`${SocketOnDistrito.agregar}.${depto}`, handleAgregar);
      socket?.off(`${SocketOnDistrito.editar}.${depto}`, handleEditar);
      socket?.off(`${SocketOnDistrito.eliminar}.${depto}`, handleEliminar);
    };
  }, [socket, setDistritosData, depto]);
};
