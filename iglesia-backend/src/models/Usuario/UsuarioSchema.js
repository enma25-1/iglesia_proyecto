import { Schema } from "mongoose";
import { roles } from "../../helpers/usuarioProps";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export const UsuarioSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    lastname: {
      type: String,
      trim: true,
      required: true,
    },
    tel: {
      type: String,
      trim: true,
      required: true,
    },
    photo: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    online: {
      type: Boolean,
      default: false,
    },
    rol: {
      type: String,
      enum: roles,
      default: "ADMINISTRATIVO",
    },
    estado: {
      type: Boolean, // Aquí defines los valores permitidos
      default: true, // Valor por defecto
    },
  },
  { timestamps: true },
);
UsuarioSchema.method("toJSON", function () {
  const { __v, ...rest } = this.toObject();
  return { ...rest, uid: rest._id };
});
UsuarioSchema.plugin(mongooseAggregatePaginate);
