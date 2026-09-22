import { lazy } from "react";

export default {
  Page: lazy(() => import("../pages/Page/Page")), 
  Depto: lazy(() => import("../pages/Depto/Depto")),
  Usuario: lazy(() => import("../pages/Usuario/Usuario")),
  Parroquia: lazy(() => import("../pages/Parroquia/Parroquia")),
  Ministro: lazy(() => import("../pages/Ministro/Ministro")),
  Seccion: lazy(() => import("../pages/Seccion/Seccion")),
  Confirmacion: lazy(() => import("../pages/Confirmacion/Confirmacion")),
  Supletoria: lazy(() => import("../pages/Confirmacion/Supletoria")),
};
