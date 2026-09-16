import { createContext } from "react";
import { useAuthStore, useSocket } from "../hooks";
import { Socket } from "socket.io-client";
import { getEnvVariables, EnvVariables } from "../helpers";
import { useEffect } from "react";

export const SocketContext = createContext({
  socket: null as Socket | null,
  online: false,
});

const { VITE_API_URL } = getEnvVariables() as EnvVariables;

export const SocketProvider = ({ children }: { children: JSX.Element }) => {
  const { socket, online, conectarSocket, desconectarSocket } =
    useSocket(VITE_API_URL);
  const { status } = useAuthStore();

  useEffect(() => {
    if (status === "authenticated") {
      conectarSocket();
    }
  }, [status]);

  useEffect(() => {
    if (status === "not-authenticated") {
      desconectarSocket();
    }
  }, [status]);

  return (
    <SocketContext.Provider value={{ socket, online }}>
      {children}
    </SocketContext.Provider>
  );
};
