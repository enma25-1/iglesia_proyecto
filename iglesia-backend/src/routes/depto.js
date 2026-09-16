// HOST + "/api/"
import express from "express";
import { getDeptos, searchDepto } from "../controllers";
import { validarToken } from "../middlewares";
export const deptoRouter = express.Router();
deptoRouter.use(validarToken);
deptoRouter.post("/", getDeptos);
deptoRouter.post("/search", searchDepto);
