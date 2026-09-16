import { Schema } from "mongoose";
import { roles } from "../../helpers";
export const PageSchema = new Schema(
  {
    componente: {
      type: String,
      required: true,
    },
    nombre: {
      type: String,
      required: true,
      unique: true,
    },
    icono: {
      type: String,
      required: true,
    },
    padre: {
      type: String,
      default: "",
    },
    tipo: {
      type: String,
      enum: ["SECCION", "ITEM"],
      default: "ITEM",
    },
    orden: {
      type: Number,
      required: true,
    },
    delete: {
      type: [String],
      enum: roles,
      default: ["GERENTE"],
    },
    update: {
      type: [String],
      enum: roles,
      default: ["GERENTE"],
    },
    insert: {
      type: [String],
      enum: roles,
      default: ["GERENTE"],
    },

    ver: {
      type: [String],
      enum: roles,
      default: ["GERENTE"],
    },
    rUsuario: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    eUsuario: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
    },
  },
  { timestamps: true }
);
