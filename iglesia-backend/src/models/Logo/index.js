// index.js
import { model } from "mongoose";
import { LogoSchema } from "./LogoSchema";
import "./pre";
import "./post";

export const LogoModel = model("Logo", LogoSchema);
