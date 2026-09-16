// index.js
import { model } from "mongoose";
import { MinistroSchema } from "./MinistroSchema";
import "./pre";
import "./post";

export const MinistroModel = model("Ministro", MinistroSchema);
