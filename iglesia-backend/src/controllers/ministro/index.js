import { MinistroModel } from "../../models/Ministro";
import { ConfirmacionModel } from "../../models/Confirmacion";

export const getMinistros = async (req, res = response) => {
  try {
    const {
      pagination: { page, limit },
      sort: { campo, asc },
      busqueda,
    } = req.body;
    const aggregation = MinistroModel.aggregate([
      {
        $match: {
          $or: [{ name: new RegExp(busqueda, "i") }],
        },
      },
      {
        $sort: {
          [campo]: asc ? 1 : -1,
        },
      },
    ]);

    const result = await MinistroModel.aggregatePaginate(aggregation, {
      page,
      limit,
    });

    res.status(200).json(result);
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      error: true,
      msg: String(error) || "Hubo un error al obtener las ministros",
    });
  }
};

// SOCKET
export const getAllMinistroF = async (req, res = response) => {
  try {
    const response = await MinistroModel.find().select(["name", "estado", "orden"]);
    res.status(200).json(response);
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      error: true,
      msg: "Hubo un error al obtener las ministros",
    });
  }
};
export const searchMinistro = async (req, res = response) => {
  const { search } = req.body;
  try {
    const response = await MinistroModel.find({
      name: new RegExp(search, "i"),
    })
      .select(["name", "orden"])
      .limit(30);
    res.status(200).json(response);
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      error: true,
      msg: "Hubo un error al obtener las ministros",
    });
  }
};
export const agregarMinistro = async (item) => {
  try {
    const newMinistro = new MinistroModel(item);
    await newMinistro.save();
    return {
      result: newMinistro,
      error: false,
      msg: "Agregado con exito!",
    };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      msg: String(error) || "Hubo un error al editar la ministro",
    };
  }
};
export const editarMinistro = async (item) => {
  try {
    const response = await MinistroModel.findOneAndUpdate(
      { _id: item._id },
      item,
      { new: true },
    );

    return {
      error: false,
      msg: "Editado con exito!",
      result: response,
    };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      msg: String(error) || "Hubo un error al editar la ministro",
    };
  }
};

export const eliminarMinistro = async (item) => {
  try {
    const usado = await ConfirmacionModel.findOne({
      $or: [
        { "ministro._id": item._id },
        { "ministroConfirma._id": item._id },
      ],
    });
    if (usado) {
      return { error: true, msg: "No se puede eliminar: este ministro está asociado a una o más confirmaciones" };
    }
    await MinistroModel.deleteOne(item);
    return { error: false, msg: "Eliminado con exito!" };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      msg: String(error) || "Hubo un error al eliminar la ministro",
    };
  }
};
