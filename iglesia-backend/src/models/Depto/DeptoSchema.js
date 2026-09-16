// DeptoSchema.js
import { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export const DeptoSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

DeptoSchema.plugin(mongooseAggregatePaginate);
