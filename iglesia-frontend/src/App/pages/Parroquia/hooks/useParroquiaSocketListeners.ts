// import { useEffect } from "react";
// import { ParroquiaItem } from "..";
// import { SocketOnParroquia } from "../helpers";
// import { Socket } from "socket.io-client";
// import { DefaultEventsMap } from "@socket.io/component-emitter";
// import { socketChildListener } from "../../../../interfaces/global";

// type Props = {
//   socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
//   onAgregarParroquia: (data: ParroquiaItem) => void;
//   onEditParroquia: (data: ParroquiaItem) => void;
//   onEliminarParroquia: (id: string) => void;
//   onAddOrRemoveMunicipio: (data: {
//     _id: string;
//     tipo: socketChildListener;
//   }) => void;
// };

// export function useParroquiaSocketListeners({
//   socket,
//   onAgregarParroquia,
//   onEditParroquia,
//   onEliminarParroquia,
//   onAddOrRemoveMunicipio,
// }: Props) {
//   useEffect(() => {
//     if (!socket) return;

//     socket.on(SocketOnParroquia.agregar, onAgregarParroquia);
//     socket.on(SocketOnParroquia.editar, onEditParroquia);
//     socket.on(SocketOnParroquia.eliminar, (data: { _id: string }) =>
//       onEliminarParroquia(data._id)
//     );
//     socket.on(SocketOnParroquia.municipioListener, onAddOrRemoveMunicipio);

//     return () => {
//       socket.off(SocketOnParroquia.agregar, onAgregarParroquia);
//       socket.off(SocketOnParroquia.editar, onEditParroquia);
//       socket.off(SocketOnParroquia.eliminar);
//       socket.off(SocketOnParroquia.municipioListener, onAddOrRemoveMunicipio);
//     };
//   }, [
//     socket,
//     onAgregarParroquia,
//     onEditParroquia,
//     onEliminarParroquia,
//     onAddOrRemoveMunicipio,
//   ]);
// }
