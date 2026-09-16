// RUTAS DE  USUARIOS
// HOST + "/api/"
import express from "express";
import {
  getParroquias,
  searchParroquia,
  agregarParroquia,
  editarParroquia,
  eliminarParroquia,
  getAllParroquiasF,
} from "../controllers";
import { validarToken } from "../middlewares";

export const parroquiaRouter = express.Router();

parroquiaRouter.use(validarToken);

// Obtener parroquias (paginado, búsqueda, etc.)
parroquiaRouter.post("/", getParroquias);
parroquiaRouter.get("/getAllF", getAllParroquiasF);

// Buscar parroquia (por nombre, para autocompletar, etc.)
parroquiaRouter.post("/search", searchParroquia);

// Agregar nueva parroquia
parroquiaRouter.post("/add", async (req, res) => {
  const result = await agregarParroquia(req.body);
  if (result.error) {
    return res.status(500).json(result);
  }
  res.status(201).json(result);
});

// Editar parroquia existente
parroquiaRouter.put("/edit", async (req, res) => {
  const result = await editarParroquia(req.body);
   

  if (result.error) {
    return res.status(500).json(result);
  }
  res.status(200).json(result);
});

// Eliminar parroquia
parroquiaRouter.delete("/delete", async (req, res) => {
  const result = await eliminarParroquia(req.body);
  if (result.error) {
    return res.status(500).json(result);
  }
  res.status(200).json(result);
});
