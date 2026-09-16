// DeptoPreMiddlewares.js
import { DeptoModel } from ".";
import { DistritoModel } from "../Distrito";
import { MunicipioModel } from "../Municipio";
import { DeptoSchema } from "./DeptoSchema";

DeptoSchema.pre("findOneAndUpdate", async function (next) {
  const deptoUpdate = this.getUpdate();
  if (deptoUpdate.name) {
    const existingDepto = await DeptoModel.findOne({ name: deptoUpdate.name });
    if (
      existingDepto &&
      String(existingDepto._id) !== String(this.getQuery()._id)
    ) {
      throw new Error("Ya existe un departamento con ese nombre");
    }
  }
  next();
});

DeptoSchema.pre("save", async function (next) {
  const depto = this;
  const existingDepto = await DeptoModel.findOne({ name: depto.name });
  if (existingDepto) {
    throw new Error("Ya existe un departamento con ese nombre");
  }
  next();
});

DeptoSchema.pre("findOneAndDelete", async function (next) {
  const depto = await this.model.findOne(this.getFilter());
  const existingDistrito = await DistritoModel.findOne({
    depto: depto._id,
  });
  if (existingDistrito) {
    throw new Error(
      "No se puede eliminar el departamento porque ya hay distritos asociados a este departamento"
    );
  }
  const existingMunicipio = await MunicipioModel.findOne({
    depto: depto._id,
  });
  if (existingMunicipio) {
    throw new Error(
      "No se puede eliminar el departamento porque ya hay municipios asociados a este departamento"
    );
  }
  next();
});
