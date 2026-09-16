// index.js
import { model } from "mongoose";
import { ConfirmacionSchema } from "./ConfirmacionSchema";
import "./pre";
import "./post";

export const ConfirmacionModel = model("Confirmacion", ConfirmacionSchema);
