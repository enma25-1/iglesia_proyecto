// RUTAS DE  USUARIOS
// HOST + "/api/auth"
import express from "express";
import { check } from "express-validator";

import {
  actualizarUsuario,
  createUsuario,
  loginUsuario,
  renewToken,
} from "../controllers";
import { validarCampos } from "../middlewares";
import { validarToken } from "../middlewares/validarToken";
export const authRouter = express.Router();

authRouter.post(
  "/new",
  [
    check("name", "El nombre es obligatorio").notEmpty(),
    check("username", "El username es obligatorio").notEmpty(),
    check("password", "El password debe de 6 caracteres").isLength({ min: 6 }),
    validarCampos,
  ],
  createUsuario
);

authRouter.post(
  "/",
  [
    check("username", "El username es obligatorio").notEmpty(),
    check("password", "El password debe de 6 caracteres").isLength({ min: 6 }),
    validarCampos,
  ],
  loginUsuario
);

authRouter.get("/renew", validarToken, renewToken);
authRouter.post("/edit", validarToken, actualizarUsuario);
