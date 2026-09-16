import { MunicipioModel } from "../Municipio";
import { ParroquiaModel } from "../Parroquia";
import { MinistroModel } from "../Ministro";
import { DistritoSchema } from "./DistritoSchema";

DistritoSchema.post("findOneAndUpdate", async function updateMunicipios(doc) {
  await MunicipioModel.updateMany(
    { "distrito._id": doc._id },
    { $set: { "distrito.name": doc.name } }
  );
  await ParroquiaModel.updateMany(
    { "distrito._id": doc._id },
    { $set: { "distrito.name": doc.name } }
  );
  await MinistroModel.updateMany(
    { "distrito._id": doc._id },
    { $set: { "distrito.name": doc.name } }
  );
});
