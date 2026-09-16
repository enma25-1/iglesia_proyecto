// RUTAS DE  USUARIOS
// HOST + "/api/"
import express from "express";
import { getMunicipios, searchMunicipiosByDepto } from "../controllers";
import { validarToken } from "../middlewares";

export const municipioRouter = express.Router();

municipioRouter.use(validarToken);
municipioRouter.post("/", getMunicipios);
municipioRouter.post("/searchByDepto", searchMunicipiosByDepto);
