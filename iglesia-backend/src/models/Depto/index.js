// index.js
import { model } from "mongoose";
import { DeptoSchema } from "./DeptoSchema";
import "./pre";
import "./post";

export const DeptoModel = model("Depto", DeptoSchema);
