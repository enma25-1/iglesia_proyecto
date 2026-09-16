import { useEffect } from "react";
import { SocketOnDepto } from "../helpers";
import { useProvideSocket } from "../../../../hooks";
import { DeptoItem } from "../interfaces";
import { Pagination, socketChildListener } from "../../../../interfaces/global";

// Tipos para las funciones de manejo de eventos
type HandleAgregar = (data: DeptoItem) => void;
type HandleEditar = (data: DeptoItem) => void;
type HandleEliminar = (data: { _id: string }) => void;
type HandleMunicipioChange = (data: {
  _id: string;
  tipo: socketChildListener;
}) => void;

export const useSocketEvents = ({
  setDeptosData,
  setPagination,
}: {
  setDeptosData: React.Dispatch<React.SetStateAction<DeptoItem[]>>;
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>;
}) => {
  const handleAgregar: HandleAgregar = (data) => {
    setPagination((prev) => ({ ...prev, totalDocs: prev.totalDocs + 1 }));
    setDeptosData((prev) => [
      { ...data, crud: { nuevo: true }, totalMunicipios: 0 },
      ...prev,
    ]);
  };
  const handleEditar: HandleEditar = (data) =>
    setDeptosData((prev) =>
      prev.map((item) =>
        item._id === data._id ? { ...data, crud: { editado: true } } : item
      )
    );
  const handleEliminar: HandleEliminar = ({ _id }) =>
    setDeptosData((prev) => prev.filter((item) => item._id !== _id));
  const handleMunicipioChange: HandleMunicipioChange = ({ _id, tipo }) => {
    setDeptosData((prev) =>
      prev.map((item) =>
        item._id === _id
          ? {
              ...item,
              crud: { editado: true },
              totalMunicipios:
                tipo === "remove"
                  ? (item.totalMunicipios || 0) - 1
                  : (item.totalMunicipios || 0) + 1,
            }
          : item
      )
    );
  };
  const { socket } = useProvideSocket();
  useEffect(() => {
    socket?.on(SocketOnDepto.agregar, handleAgregar);
    socket?.on(SocketOnDepto.editar, handleEditar);
    socket?.on(SocketOnDepto.eliminar, handleEliminar);
    socket?.on(SocketOnDepto.municipioListener, handleMunicipioChange);

    return () => {
      socket?.off(SocketOnDepto.agregar, handleAgregar);
      socket?.off(SocketOnDepto.editar, handleEditar);
      socket?.off(SocketOnDepto.eliminar, handleEliminar);
      socket?.off(SocketOnDepto.municipioListener, handleMunicipioChange);
    };
  }, [socket, setDeptosData]);
};
