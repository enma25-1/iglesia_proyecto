import * as Iconos from "@mui/icons-material";
import Componentes from "../App/router/routes";

export const ConvertirIcono = (
  icono?: string,
  size: string = "medium",
  color: string = ""
) => {
  if (!icono) {
    return <Iconos.Abc />;
  }
  const Icono = (Iconos as any)[icono] || Iconos.Menu;
  return <Icono fontSize={size} color={color} />;
};
export const ConvertirComponente = (nombre: string) => {
  const Componente = (Componentes as any)[nombre];
  
  if (Componente === undefined) {
    console.log(`Componente no encontrado: ${nombre}`);
    // console.log(`Componente no encontrado: ${nombre}`);
    return <div>Componente no encontrado</div>;
  }
  return <Componente />;
};
