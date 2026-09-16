import { MunicipioModel } from "../Municipio";
import { ParroquiaModel } from "../Parroquia";
import { MinistroModel } from "../Ministro";
import { DistritoSchema } from "./DistritoSchema";

DistritoSchema.pre("findOneAndUpdate", async function (next) {
  next();
});

DistritoSchema.pre("save", async function (next) {
  next();
});

DistritoSchema.pre("findOneAndDelete", async function (next) {
  const distrito = await this.model.findOne(this.getFilter());
  const existingMunicipio = await MunicipioModel.findOne({
    distrito: distrito._id,
  });
  if (existingMunicipio) {
    throw new Error(
      "No se puede eliminar el distrito porque ya hay municipios asociados a este distrito"
    );
  }
  const existingParroquia = await ParroquiaModel.findOne({
    "distrito._id": distrito._id,
  });
  if (existingParroquia) {
    throw new Error(
      "No se puede eliminar el distrito porque ya hay parroquias asociadas a este distrito"
    );
  }
  const existingMinistro = await MinistroModel.findOne({
    "distrito._id": distrito._id,
  });
  if (existingMinistro) {
    throw new Error(
      "No se puede eliminar el distrito porque ya hay ministros asociados a este distrito"
    );
  }
  next();
});
