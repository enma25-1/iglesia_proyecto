// HOST + "/api/"
import express from "express";
import {
  getUsuariosTable,
  agregarUsuario,
  editarUsuario,
  eliminarUsuario,
} from "../controllers";
import { validarToken } from "../middlewares";

export const usuarioRouter = express.Router();
usuarioRouter.use(validarToken);
usuarioRouter.post("/", getUsuariosTable);

// Agregar nueva usuario
usuarioRouter.post("/add", async (req, res) => {
  const result = await agregarUsuario(req.body);
  if (result.error) {
    return res.status(500).json(result);
  }
  res.status(201).json(result);
});

// Editar usuario existente
usuarioRouter.put("/edit", async (req, res) => {
  const result = await editarUsuario(req.body);
  if (result.error) {
    return res.status(500).json(result);
  }
  res.status(200).json(result);
});

// Eliminar usuario
usuarioRouter.delete("/delete", async (req, res) => {
  const result = await eliminarUsuario(req.body);
  if (result.error) {
    return res.status(500).json(result);
  }
  res.status(200).json(result);
});
