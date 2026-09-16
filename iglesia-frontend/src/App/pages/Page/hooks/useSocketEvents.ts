import { useEffect } from "react";
import { SocketOnPage } from "../helpers";
import { useProvideSocket } from "../../../../hooks";
import { PageItem } from "../interfaces";
import { usePageStore } from "./usePageStore";

// Tipos para las funciones de manejo de eventos
type HandleAgregar = (data: PageItem) => void;
type HandleEditar = (data: PageItem) => void;
export const useSocketEvents = () => {
  const { onEditPage, onAgregarPage } = usePageStore();
  const handleAgregar: HandleAgregar = (data) => onAgregarPage(data);
  const handleEditar: HandleEditar = (data) => onEditPage(data);
  const { socket } = useProvideSocket();
  useEffect(() => {
    socket?.on(SocketOnPage.agregar, handleAgregar);
    socket?.on(SocketOnPage.editar, handleEditar);

    return () => {
      //DEJAR DE ESCUCHAR
      socket?.off(SocketOnPage.agregar, handleAgregar);
      socket?.off(SocketOnPage.editar, handleEditar);
    };
  }, [socket]);
};
