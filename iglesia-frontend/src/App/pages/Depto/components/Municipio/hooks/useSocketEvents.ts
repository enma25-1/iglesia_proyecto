import { Dispatch, useEffect } from "react";
import { SocketOnMunicipio } from "../helpers"; // Asegúrate de importar el enum correcto

import { MunicipioItem } from "../interfaces"; // Asegúrate de importar la interfaz correcta
import { Pagination } from "../../../../../../interfaces/global";
import { useProvideSocket } from "../../../../../../hooks";

// Tipos para las funciones de manejo de eventos
type HandleAgregar = (data: MunicipioItem) => void;
type HandleEditar = (data: MunicipioItem) => void;
type HandleEliminar = (data: { _id: string }) => void;

export const useMunicipioSocketEvents = ({
  setMunicipiosData,
  setPagination,
  depto,
}: {
  setMunicipiosData: React.Dispatch<React.SetStateAction<MunicipioItem[]>>;
  setPagination: Dispatch<React.SetStateAction<Pagination>>;
  depto: string;
}) => {
  const handleAgregar: HandleAgregar = (data) => {
    setPagination((prev) => ({ ...prev, totalDocs: prev.totalDocs + 1 }));
    setMunicipiosData((prev) => [{ ...data, crud: { nuevo: true } }, ...prev]);
  };
  const handleEditar: HandleEditar = (data) =>
    setMunicipiosData((prev) =>
      prev.map((item) =>
        item._id === data._id ? { ...data, crud: { editado: true } } : item
      )
    );
  const handleEliminar: HandleEliminar = ({ _id }) => {
    setMunicipiosData((prev) => prev.filter((item) => item._id !== _id));
    setPagination((prev) => ({ ...prev, totalDocs: prev.totalDocs - 1 }));
  };

  const { socket } = useProvideSocket();
  useEffect(() => {
    socket?.on(`${SocketOnMunicipio.agregar}.${depto}`, handleAgregar);
    socket?.on(`${SocketOnMunicipio.editar}.${depto}`, handleEditar);
    socket?.on(`${SocketOnMunicipio.eliminar}.${depto}`, handleEliminar);

    return () => {
      socket?.off(`${SocketOnMunicipio.agregar}.${depto}`, handleAgregar);
      socket?.off(`${SocketOnMunicipio.editar}.${depto}`, handleEditar);
      socket?.off(`${SocketOnMunicipio.eliminar}.${depto}`, handleEliminar);
    };
  }, [socket, setMunicipiosData, depto]);
};
