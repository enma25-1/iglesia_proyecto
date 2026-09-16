import { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export const DistritoSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  depto: {
    type: Schema.Types.ObjectId,
    ref: "Depto",
    required: true,
  },
  municipio: {
    type: Schema.Types.ObjectId,
    ref: "Municipio",
    required: true,
  },
});

DistritoSchema.plugin(mongooseAggregatePaginate);
