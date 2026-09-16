// RUTAS DE  USUARIOS
// HOST + "/api/"
import express from "express";
import {
  getMinistros,
  searchMinistro,
  agregarMinistro,
  editarMinistro,
  eliminarMinistro,
  getAllMinistroF,
} from "../controllers";
import { validarToken } from "../middlewares";

export const ministroRouter = express.Router();

ministroRouter.use(validarToken);

// Obtener ministros (paginado, búsqueda, etc.)
ministroRouter.post("/", getMinistros);
ministroRouter.get("/getAllF", getAllMinistroF);

// Buscar ministro (por nombre, para autocompletar, etc.)
ministroRouter.post("/search", searchMinistro);

// Agregar nueva ministro
ministroRouter.post("/add", async (req, res) => {
  const result = await agregarMinistro(req.body);
  if (result.error) {
    return res.status(500).json(result);
  }
  res.status(201).json(result);
});

// Editar ministro existente
ministroRouter.put("/edit", async (req, res) => {
  const result = await editarMinistro(req.body);
   

  if (result.error) {
    return res.status(500).json(result);
  }
  res.status(200).json(result);
});

// Eliminar ministro
ministroRouter.delete("/delete", async (req, res) => {
  const result = await eliminarMinistro(req.body);
  if (result.error) {
    return res.status(500).json(result);
  }
  res.status(200).json(result);
});
