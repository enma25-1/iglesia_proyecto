import { toast } from "react-toastify";
import { DataAlerta } from "../../App/components";
import { ErrorBackend, ErrorSocket } from "../../interfaces/global";

export const handleSocket = ({ error, msg, subtitulo }: ErrorSocket) => {
  if (error) {
    toast.error(<DataAlerta titulo={msg} />);
  }
  if (!error) {
    toast.success(<DataAlerta titulo={msg} subtitulo={subtitulo} />);
  }
};

interface AxiosError extends Error {
  response?: {
    data?: {
      msg: string;
    };
  };
}

export const handleAxiosError = (
  error: AxiosError,
  defaultString: string
): ErrorBackend => ({
  msg: error?.response?.data?.msg || defaultString,
  error: true,
});
