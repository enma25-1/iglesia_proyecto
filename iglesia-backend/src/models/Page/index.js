// index.js
import { model } from "mongoose";
import { PageSchema } from "./PageSchema";
import "./pre";
import "./post";

export const PageModel = model("Page", PageSchema);
