import { ParroquiaSchema } from "./ParroquiaSchema";

ParroquiaSchema.pre("findOneAndUpdate", async function (next) {
  next();
});

ParroquiaSchema.pre("save", async function (next) {
  next();
});
