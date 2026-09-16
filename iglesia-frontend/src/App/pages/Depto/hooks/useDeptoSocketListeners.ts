import { useEffect } from "react";
import { DeptoItem } from "..";
import { SocketOnDepto } from "../helpers";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { socketChildListener } from "../../../../interfaces/global";

type Props = {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
  onAgregarDepto: (data: DeptoItem) => void;
  onEditDepto: (data: DeptoItem) => void;
  onEliminarDepto: (id: string) => void;
  onAddOrRemoveMunicipio: (data: {
    _id: string;
    tipo: socketChildListener;
  }) => void;
};

export function useDeptoSocketListeners({
  socket,
  onAgregarDepto,
  onEditDepto,
  onEliminarDepto,
  onAddOrRemoveMunicipio,
}: Props) {
  useEffect(() => {
    if (!socket) return;

    socket.on(SocketOnDepto.agregar, onAgregarDepto);
    socket.on(SocketOnDepto.editar, onEditDepto);
    socket.on(SocketOnDepto.eliminar, (data: { _id: string }) =>
      onEliminarDepto(data._id)
    );
    socket.on(SocketOnDepto.municipioListener, onAddOrRemoveMunicipio);

    return () => {
      socket.off(SocketOnDepto.agregar, onAgregarDepto);
      socket.off(SocketOnDepto.editar, onEditDepto);
      socket.off(SocketOnDepto.eliminar);
      socket.off(SocketOnDepto.municipioListener, onAddOrRemoveMunicipio);
    };
  }, [
    socket,
    onAgregarDepto,
    onEditDepto,
    onEliminarDepto,
    onAddOrRemoveMunicipio,
  ]);
}
