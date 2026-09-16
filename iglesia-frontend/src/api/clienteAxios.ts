import axios, { AxiosRequestHeaders } from "axios";
import { getEnvVariables, EnvVariables } from "../helpers";

const { VITE_API_URL } = getEnvVariables() as EnvVariables;

const clienteAxios = axios.create({
  baseURL: VITE_API_URL + "api",
});

//todo: CONFIGURAR INTERCEPTORES
clienteAxios.interceptors.request.use((config) => {
  config.headers = {
    ...config.headers,
    "x-token": localStorage.getItem("token") || "",
  } as unknown as AxiosRequestHeaders;
  return config;
});

export default clienteAxios;
