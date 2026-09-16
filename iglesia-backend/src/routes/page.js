// RUTAS DE  USUARIOS
// HOST + "/api/pages"
import express from "express";
import { getPages } from "../controllers";
import { validarToken } from "../middlewares";
export const pagesRouter = express.Router();
pagesRouter.get("/",  getPages);
