import { DefaultEventsMap } from "@socket.io/component-emitter";
import { useEffect, useCallback, useState } from "react";
import { Socket, io } from "socket.io-client";

export const useSocket = (serverPath: string) => {
  const [online, setonline] = useState(false);

  const [socket, setsocket] = useState<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>(null);

  const conectarSocket: () => void = useCallback(() => {
    const token = localStorage.getItem("token");
    const socketTemp = io(serverPath, {
      autoConnect: true,
      forceNew: true,
      transports: ["websocket"],
      query: {
        "x-token": token,
      },
    });
    setsocket(socketTemp);
  }, [serverPath]);

  const desconectarSocket: () => void = useCallback(() => {
    socket?.disconnect();
  }, [socket]);

  useEffect(() => {
    socket?.on("disconnect", () => {
      console.log("disconnect");

      setonline(false);
    });
  }, [socket]);
  useEffect(() => {
    setonline(socket?.connected!);
    socket?.on("connect", () => {
      console.log("connect");

      setonline(true);
    });
  }, [socket]);
  return { socket, online, conectarSocket, desconectarSocket };
};
