import express from "express";
import { getDistritos, searchDistritosByDepto } from "../controllers";
import { validarToken } from "../middlewares";

export const distritoRouter = express.Router();

distritoRouter.use(validarToken);
distritoRouter.post("/", getDistritos);
distritoRouter.post("/searchByDepto", searchDistritosByDepto);
