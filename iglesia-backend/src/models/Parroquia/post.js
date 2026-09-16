import { ConfirmacionModel } from "../Confirmacion";
import { ParroquiaSchema } from "./ParroquiaSchema";

ParroquiaSchema.post("findOneAndUpdate", async function updateConfirmaciones(doc) {
  if (!doc) return;
  const updateFields = {};
  if (doc.name) updateFields.name = doc.name;
  if (doc.direccion) updateFields.direccion = doc.direccion;

  if (Object.keys(updateFields).length === 0) return;

  const setBautismo = {};
  const setConfirmacion = {};
  if (updateFields.name) {
    setBautismo["parroquiaBustismo.name"] = updateFields.name;
    setConfirmacion["parroquiaConfirmacion.name"] = updateFields.name;
  }
  if (updateFields.direccion) {
    setBautismo["parroquiaBustismo.direccion"] = updateFields.direccion;
    setConfirmacion["parroquiaConfirmacion.direccion"] = updateFields.direccion;
  }

  if (Object.keys(setBautismo).length > 0) {
    await ConfirmacionModel.updateMany(
      { "parroquiaBustismo._id": doc._id },
      { $set: setBautismo }
    );
  }
  if (Object.keys(setConfirmacion).length > 0) {
    await ConfirmacionModel.updateMany(
      { "parroquiaConfirmacion._id": doc._id },
      { $set: setConfirmacion }
    );
  }
});
