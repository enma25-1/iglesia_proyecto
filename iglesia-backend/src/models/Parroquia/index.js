// index.js
import { model } from "mongoose";
import { ParroquiaSchema } from "./ParroquiaSchema";
import "./pre";
import "./post";

export const ParroquiaModel = model("Parroquia", ParroquiaSchema);
