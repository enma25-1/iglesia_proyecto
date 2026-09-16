// RUTAS DE  USUARIOS
// HOST + "/api/"
import express from "express";
import { validarToken } from "../middlewares";
import { uploadSingle } from "../middlewares/upload";

export const uploadRouter = express.Router();

uploadRouter.use(validarToken);

uploadRouter.post("/", uploadSingle("file"), async (req, res) => {
  console.log(req.file);
  if (!req.file) {
    return res.status(400).json({ ok: false, msg: "No se recibió archivo" });
  }

  // Devuelve información básica del archivo subido
  res.status(201).json({
    ok: true,
    file: {
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`,
    },
  });
});
