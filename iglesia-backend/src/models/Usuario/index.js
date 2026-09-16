// index.js
import { model } from "mongoose";
import { UsuarioSchema } from "./UsuarioSchema";
import "./pre";
import "./post";

export const UsuarioModel = model("Usuario", UsuarioSchema);
