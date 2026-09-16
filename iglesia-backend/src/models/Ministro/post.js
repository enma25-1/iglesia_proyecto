import { ConfirmacionModel } from "../Confirmacion";
import { MinistroSchema } from "./MinistroSchema";

MinistroSchema.post("findOneAndUpdate", async function updateConfirmaciones(doc) {
  if (!doc || !doc.name) return;

  const update = { name: doc.name };
  if (doc.orden) {
    update.orden = doc.orden;
  }

  await ConfirmacionModel.updateMany(
    { "ministro._id": doc._id },
    { $set: { "ministro.name": update.name, ...(update.orden && { "ministro.orden": update.orden }) } }
  );
  await ConfirmacionModel.updateMany(
    { "ministroConfirma._id": doc._id },
    { $set: { "ministroConfirma.name": update.name, ...(update.orden && { "ministroConfirma.orden": update.orden }) } }
  );
});
