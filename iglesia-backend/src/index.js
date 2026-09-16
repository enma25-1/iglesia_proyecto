import express from "express";
import { config } from "dotenv";
import cors from "cors";

config();

import { dbConnection } from "./db/config";
import { runSeed } from "./seed/seed";

import {
  deptoSocket,
  distritoSocket,
  pageSocket,
  municipioSocket,
  usuarioSocket,
} from "./sockets";
import {
  authRouter,
  municipioRouter,
  pagesRouter,
  deptoRouter,
  distritoRouter,
  usuarioRouter,
  parroquiaRouter,
  confirmacionRouter,
} from "./routes";
import { createServer } from "http";
import socketio from "socket.io";
import { ministroRouter } from "./routes/ministro";
import { reporteRouter } from "./routes/reporte";
import { uploadRouter } from "./routes/upload";
import path from "path";

const app = express();

app.use(express.json());
app.use(cors());

app.use(express.static("public"));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/uploads", express.static("uploads"));

app.use("/api/auth", authRouter);
app.use("/api/page", pagesRouter);
app.use("/api/depto", deptoRouter);
app.use("/api/distrito", distritoRouter);
app.use("/api/municipio", municipioRouter);
app.use("/api/usuario", usuarioRouter);
app.use("/api/parroquia", parroquiaRouter);
app.use("/api/ministro", ministroRouter);
app.use("/api/confirmacion", confirmacionRouter);
app.use("/api/reporte", reporteRouter);
app.use("/api/upload", uploadRouter);

const server = createServer(app);
const io = socketio(server, {});

pageSocket(io);
deptoSocket(io);
distritoSocket(io);
municipioSocket(io);
usuarioSocket(io);

const start = async () => {
  await dbConnection();
  await runSeed();
  server.listen(process.env.PORT, "0.0.0.0", () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
  });
};

start();
