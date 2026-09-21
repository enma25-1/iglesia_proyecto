import { useDispatch, useSelector } from "react-redux";
import {
  LoginParams,
  RegisterParams,
  RootState,
  Usuario,
} from "../../store/interfaces";
import {
  clearErrorMessage,
  onSEditUsuario,
  onSLogin,
  onSLogout,
  onStoggleDarkMode,
} from "../../store/auth";
import { clienteAxios } from "../../api";

interface UsuarioWithToken extends Usuario {
  token: string;
}

export const useAuthStore = () => {
  const { status, usuario, errorMessage, theme } = useSelector(
    (state: RootState) => state.auth,
  );
  const dispatch = useDispatch();

  const onStartLogin = async ({ username, password }: LoginParams) => {
    // dispatch(onSchecking());
    try {
      const {
        data: { token, ...rest },
      }: { data: UsuarioWithToken } = await clienteAxios.post("/auth", {
        username,
        password,
      });
      localStorage.setItem("token", token);
      localStorage.setItem("token-init-data", new Date().getTime().toString());
      dispatch(onSLogin(rest));
    } catch (error: any) {
      const msgError =
        error?.response?.data?.msg ||
        (error?.response
          ? "Credenciales incorrectas"
          : "No se pudo conectar con el servidor");
      dispatch(onSLogout(msgError));
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
    }
  };

  const onStartRegister = async (arg: RegisterParams) => {
    // dispatch(onSchecking());
    try {
      const {
        data: { token, ...rest },
      }: { data: UsuarioWithToken } = await clienteAxios.post("/auth/new", arg);
      localStorage.setItem("token", token);
      localStorage.setItem("token-init-data", new Date().getTime().toString());
      dispatch(onSLogin(rest));
    } catch (error: any) {
      console.log({ error });

      const msgError = error?.response?.data?.msg || "Error al registrarse";
      dispatch(onSLogout(msgError));
      setTimeout(() => {
        dispatch(clearErrorMessage());
      }, 10);
    }
  };

  const onStartSheckAuthToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) return dispatch(onSLogout("No hay token"));
    try {
      const {
        data: { token, ...rest },
      }: { data: UsuarioWithToken } = await clienteAxios.get("/auth/renew");
      localStorage.setItem("token", token);
      localStorage.setItem("token-init-data", new Date().getTime().toString());
      dispatch(onSLogin(rest));
    } catch (error: any) {
      console.log({ error });

      const msgError = error?.response?.data?.msg || "Error al loguearse";
      dispatch(onSLogout(msgError));
      localStorage.removeItem("token");
      localStorage.removeItem("token-init-data");
    }
  };

  const onStartLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("token-init-data");
    dispatch(onSLogout());
  };
  const onEditUsuario = (usuario: Usuario) => {
    dispatch(onSEditUsuario(usuario));
  };
  const toggleDarkMode = (theme: "dark" | "light") => {
    localStorage.setItem("theme", theme);
    dispatch(onStoggleDarkMode(theme));
  };
  return {
    //*Propiedades
    status,
    usuario,
    errorMessage,
    theme,
    //Metodos
    onStartLogin,
    onStartLogout,
    onStartRegister,
    onStartSheckAuthToken,
    onEditUsuario,
    toggleDarkMode,
  };
};
