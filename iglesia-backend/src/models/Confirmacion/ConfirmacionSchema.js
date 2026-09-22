import { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export const ConfirmacionSchema = new Schema(
  {
    apellidos: {
      type: String,
      required: true,
    },
    nombres: {
      type: String,
      required: true,
    },
    edad: {
      type: String,
      required: true,
    },
    parroquiaBustismo: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "Parroquia",
        required: true,
      },
      direccion: String,
      name: String,
    },
    parroquiaConfirmacion: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "Parroquia",
        required: true,
      },
      direccion: String,
      name: String,
    },
    ministro: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "Ministro",
        required: true,
      },
      name: String,
      orden: {
        name: String,
        abreviatura: String,
      },
    },
    ministroConfirma: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "Ministro",
      },
      name: String,
      orden: {
        name: String,
        abreviatura: String,
      },
    },
    padre: {
      type: String,
    },
    madre: {
      type: String,
    },
    padrino: {
      type: String,
    },
    madrina: {
      type: String,
    },
    fecha: {
      type: Date,
      required: true,
    },
    libro: {
      type: Number,
      required: true,
    },
    folio: {
      type: Number,
      required: true,
    },
    observacion: {
      type: String,
    },
    tipo: {
      type: String,
      enum: ["normal", "supletoria"],
      default: "normal",
    },
  },
  {
    timestamps: true,
  },
);
ConfirmacionSchema.plugin(mongooseAggregatePaginate);
