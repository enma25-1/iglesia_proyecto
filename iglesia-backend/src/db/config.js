import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    await mongoose.connect(`${process.env.DB_URL}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB online");
  } catch (error) {
    console.log({ error });
    throw new Error("Error al conectarse a la db");
  }
};
