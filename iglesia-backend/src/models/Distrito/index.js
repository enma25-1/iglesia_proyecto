import { model } from "mongoose";
import { DistritoSchema } from "./DistritoSchema";
import "./pre";
import "./post";

export const DistritoModel = model("Distrito", DistritoSchema);
