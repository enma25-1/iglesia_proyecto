import { ConfirmacionModel } from ".";
import { ConfirmacionSchema } from "./ConfirmacionSchema";
ConfirmacionSchema.pre("findOneAndUpdate", async function (next) {
  const confirmacionUpdate = this.getUpdate();
 
  next();
});

ConfirmacionSchema.pre("save", async function (next) {
  const confirmacion = this;
  const existingConfirmacion = await ConfirmacionModel.findOne({
    $or: [
      { apellidos: confirmacion.apellidos },
      { nombres: confirmacion.nombres },
    ],
  });

  // if (existingConfirmacion) {
  //   throw new Error("Ya existe una confirmacion con ese nombre");
  // }
  next();
});
