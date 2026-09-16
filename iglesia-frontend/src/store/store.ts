import { configureStore } from "@reduxjs/toolkit";
import { authS } from "./auth";
import { uiS } from "./ui";
import { pageS } from "../App/pages/Page/store";
import { usuarioS } from "../App/pages/Usuario/store"; 
import { deptoS } from "../App/pages/Depto/store";
import { parroquiaS } from "../App/pages/Parroquia/store";
import { ministroS } from "../App/pages/Ministro";
import { confirmacionS } from "../App/pages/Confirmacion";

export const store = configureStore({
  reducer: {
    auth: authS.reducer,
    ui: uiS.reducer,
    page: pageS.reducer,
    usuario: usuarioS.reducer, 
    depto: deptoS.reducer,
    parroquia: parroquiaS.reducer,
    ministro: ministroS.reducer,
    confirmacion: confirmacionS.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
