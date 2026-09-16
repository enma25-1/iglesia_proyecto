import { ParroquiaModel } from "../Parroquia";
import { MinistroModel } from "../Ministro";
import { MunicipioSchema } from "./MunicipioSchema";

MunicipioSchema.pre("findOneAndUpdate", async function (next) {
  next();
});

MunicipioSchema.pre("save", async function (next) {
  next();
});

MunicipioSchema.pre("findOneAndDelete", async function (next) {
  const municipio = await this.model.findOne(this.getFilter());
  const existingParroquia = await ParroquiaModel.findOne({
    "municipio._id": municipio._id,
  });
  if (existingParroquia) {
    throw new Error(
      "No se puede eliminar el municipio porque ya hay una parroquia que tiene este municipio"
    );
  }
  const existingMinistro = await MinistroModel.findOne({
    "municipio._id": municipio._id,
  });
  if (existingMinistro) {
    throw new Error(
      "No se puede eliminar el municipio porque ya hay un ministro que tiene este municipio"
    );
  }
  next();
});
