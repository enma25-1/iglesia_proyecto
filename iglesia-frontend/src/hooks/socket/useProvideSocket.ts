import { SocketContext } from "../../context";
import { useContext } from "react";

export const useProvideSocket = () => {
  const { online, socket } = useContext(SocketContext);
  return { online, socket };
};
