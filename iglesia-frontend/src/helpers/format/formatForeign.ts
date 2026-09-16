import { UsuarioForeign } from "../../App/pages/UsuarioPrev";
import { Usuario } from "../../store/interfaces";

export const formatUsuarioForeign: (usuario?: Usuario) => UsuarioForeign = (
  usuario?: Usuario
) => {
  return usuario
    ? {
        _id: usuario.uid,
        dui: usuario.dui || "",
        name: usuario.name,
        lastname: usuario.lastname,
        tel: usuario.tel,
      }
    : {
        _id: "",
        dui: "",
        name: "",
        lastname: "",
        tel: "",
      };
};
