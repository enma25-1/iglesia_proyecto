import { MinistroModel } from ".";
import { MinistroSchema } from "./MinistroSchema";

// Antes de guardar uno nuevo
MinistroSchema.pre("save", async function (next) {
  const ministro = this;

  // Validar nombre único
  const existingMinistro = await MinistroModel.findOne({ name: ministro.name });
  if (existingMinistro) {
    throw new Error("Ya existe un ministro con ese nombre");
  }

  // Si está en estado activo, desactiva a los demás
  if (ministro.estado === true) {
    await MinistroModel.updateMany({ estado: true }, { estado: false });
  }

  next();
});

// Antes de actualizar uno existente
MinistroSchema.pre("findOneAndUpdate", async function (next) {
  const ministroUpdate = this.getUpdate();
  const ministroId = this.getQuery()._id;

  // Validar nombre único
  if (ministroUpdate.name) {
    const existingMinistro = await MinistroModel.findOne({ name: ministroUpdate.name });
    if (existingMinistro && String(existingMinistro._id) !== String(ministroId)) {
      throw new Error("Ya existe un ministro con ese nombre");
    }
  }

  // Si se está activando este ministro, desactiva a los demás
  if (ministroUpdate.estado === true) {
    await MinistroModel.updateMany(
      { _id: { $ne: ministroId }, estado: true },
      { estado: false }
    );
  }

  next();
});