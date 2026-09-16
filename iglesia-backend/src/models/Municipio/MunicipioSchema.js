// MunicipioSchema.js
import { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export const MunicipioSchema = new Schema({
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
});

MunicipioSchema.plugin(mongooseAggregatePaginate);
