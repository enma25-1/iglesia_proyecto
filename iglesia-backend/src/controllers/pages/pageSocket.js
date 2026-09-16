import { PageModel } from "../../models";

// SOCKET
export const agregarPage = async (data) => {
  try {
    const { ...restPage } = data;

    // Adaptar el objeto item al esquema de Page
    const page = {
      ...restPage,
      rUsuario: restPage.rUsuario._id,
      eUsuario: null,
    };
    const newPage = new PageModel(page);
    await newPage.save();
    return {
      item: {
        ...restPage,
        _id: newPage._id,
        createdAt: newPage.createdAt,
      },
      error: false,
    };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      msg: String(error) || "Hubo un error al crear la página",
    };
  }
};

export const editarPage = async (data) => {
  try {
    const { ...restPage } = data;

    // Adaptar el objeto item al esquema de Page
    const page = {
      ...restPage,
      rUsuario: data.rUsuario._id,
      eUsuario: data.eUsuario._id,
    };
    await PageModel.findOneAndUpdate({ _id: data._id }, page, {
      new: true,
    });
    return { error: false };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      msg: String(error) || "Hubo un error al actualizar la página",
    };
  }
};
