// import { useEffect } from "react";
// import { MinistroItem } from "..";
// import { SocketOnMinistro } from "../helpers";
// import { Socket } from "socket.io-client";
// import { DefaultEventsMap } from "@socket.io/component-emitter";
// import { socketChildListener } from "../../../../interfaces/global";

// type Props = {
//   socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
//   onAgregarMinistro: (data: MinistroItem) => void;
//   onEditMinistro: (data: MinistroItem) => void;
//   onEliminarMinistro: (id: string) => void;
//   onAddOrRemoveMunicipio: (data: {
//     _id: string;
//     tipo: socketChildListener;
//   }) => void;
// };

// export function useMinistroSocketListeners({
//   socket,
//   onAgregarMinistro,
//   onEditMinistro,
//   onEliminarMinistro,
//   onAddOrRemoveMunicipio,
// }: Props) {
//   useEffect(() => {
//     if (!socket) return;

//     socket.on(SocketOnMinistro.agregar, onAgregarMinistro);
//     socket.on(SocketOnMinistro.editar, onEditMinistro);
//     socket.on(SocketOnMinistro.eliminar, (data: { _id: string }) =>
//       onEliminarMinistro(data._id)
//     );
//     socket.on(SocketOnMinistro.municipioListener, onAddOrRemoveMunicipio);

//     return () => {
//       socket.off(SocketOnMinistro.agregar, onAgregarMinistro);
//       socket.off(SocketOnMinistro.editar, onEditMinistro);
//       socket.off(SocketOnMinistro.eliminar);
//       socket.off(SocketOnMinistro.municipioListener, onAddOrRemoveMunicipio);
//     };
//   }, [
//     socket,
//     onAgregarMinistro,
//     onEditMinistro,
//     onEliminarMinistro,
//     onAddOrRemoveMunicipio,
//   ]);
// }
