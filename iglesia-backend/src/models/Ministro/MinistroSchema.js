import { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export const MinistroSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    orden: {
      name: {
        type: String,
        default: "",
      },
      abreviatura: {
        type: String,
        default: "",
      },
    },
    estado: {
      type: Boolean,
      default: true, // Valor por defecto
    },
    municipio: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "Municipio",
        required: true,
      },
      name: String,
    },
    distrito: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "Distrito",
        required: true,
      },
      name: String,
    },
    depto: {
      _id: {
        type: Schema.Types.ObjectId,
        ref: "Depto",
        required: true,
      },
      name: String,
    },
  },
  {
    timestamps: true,
  },
);
MinistroSchema.plugin(mongooseAggregatePaginate);
