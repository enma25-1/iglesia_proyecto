// DeptoPostMiddlewares.js
import { ParroquiaModel } from "../Parroquia";
import { MinistroModel } from "../Ministro";
import { DeptoSchema } from "./DeptoSchema";

DeptoSchema.post("findOneAndUpdate", async function updateDeptoName(doc) {
  const update = { "depto.name": doc.name };
  await ParroquiaModel.updateMany(
    { "depto._id": doc._id },
    { $set: update }
  );
  await MinistroModel.updateMany(
    { "depto._id": doc._id },
    { $set: update }
  );
});
