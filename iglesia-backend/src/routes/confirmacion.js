// RUTAS DE  USUARIOS
// HOST + "/api/"
import express from "express";
import {
  getConfirmaciones,
  agregarConfirmacion,
  editarConfirmacion,
  eliminarConfirmacion,
  checkDuplicateConfirmacion,
} from "../controllers";
import { validarToken } from "../middlewares";

export const confirmacionRouter = express.Router();

confirmacionRouter.use(validarToken);

// Obtener confirmaciones (paginado, búsqueda, etc.)
confirmacionRouter.post("/", getConfirmaciones);

confirmacionRouter.post("/checkDuplicate", async (req, res) => {
  const result = await checkDuplicateConfirmacion(req.body);
  res.status(200).json(result);
});

// Agregar nueva confirmacion
confirmacionRouter.post("/add", async (req, res) => {
  const result = await agregarConfirmacion(req.body);
  if (result.error) {
    return res.status(500).json(result);
  }
  res.status(201).json(result);
});

// Editar confirmacion existente
confirmacionRouter.put("/edit", async (req, res) => {
  const result = await editarConfirmacion(req.body);

  if (result.error) {
    return res.status(500).json(result);
  }
  res.status(200).json(result);
});

// Eliminar confirmacion
confirmacionRouter.delete("/delete", async (req, res) => {
  const result = await eliminarConfirmacion(req.body);
  if (result.error) {
    return res.status(500).json(result);
  }
  res.status(200).json(result);
});
