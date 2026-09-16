// MunicipioPostMiddlewares.js
import { ParroquiaModel } from "../Parroquia";
import { MinistroModel } from "../Ministro";
import { MunicipioSchema } from "./MunicipioSchema";

MunicipioSchema.post("findOneAndUpdate", async function updateMunicipioName(doc) {
  const update = { "municipio.name": doc.name };
  await ParroquiaModel.updateMany(
    { "municipio._id": doc._id },
    { $set: update }
  );
  await MinistroModel.updateMany(
    { "municipio._id": doc._id },
    { $set: update }
  );
});
