import { Schema } from "mongoose";

export const LogoSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);
