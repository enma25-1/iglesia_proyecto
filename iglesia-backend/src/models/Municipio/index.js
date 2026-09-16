// index.js
import { model } from "mongoose";
import { MunicipioSchema } from "./MunicipioSchema";
import "./pre";
import "./post";

export const MunicipioModel = model("Municipio", MunicipioSchema);
