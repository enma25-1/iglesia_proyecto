import { ParroquiaModel } from "../../models/Parroquia";
import { ConfirmacionModel } from "../../models/Confirmacion";

export const getParroquias = async (req, res = response) => {
  try {
    const {
      pagination: { page, limit },
      sort: { campo, asc },
      busqueda,
    } = req.body;
    const aggregation = ParroquiaModel.aggregate([
      {
        $match: {
          $or: [
            { name: new RegExp(busqueda, "i") },
            { direccion: new RegExp(busqueda, "i") },
            { "municipio.name": new RegExp(busqueda, "i") },
            { "depto.name": new RegExp(busqueda, "i") },
          ],
        },
      },
      {
        $sort: {
          [campo]: asc ? 1 : -1,
        },
      },
    ]);

    const result = await ParroquiaModel.aggregatePaginate(aggregation, {
      page,
      limit,
    });

    res.status(200).json(result);
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      error: true,
      msg: String(error) || "Hubo un error al obtener las parroquias",
    });
  }
};

// SOCKET
export const searchParroquia = async (req, res = response) => {
  const { search } = req.body;
  try {
    const response = await ParroquiaModel.find({
      name: new RegExp(search, "i"),
      estado: true,
    })
      .select(["name"])
      .limit(30);
    res.status(200).json(response);
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      error: true,
      msg: "Hubo un error al obtener las parroquias",
    });
  }
};
export const getAllParroquiasF = async (req, res = response) => {
  try {
    const response = await ParroquiaModel.find({
      estado: true,
    }).select(["name", "direccion"]);
    res.status(200).json(response);
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      error: true,
      msg: "Hubo un error al obtener las parroquias",
    });
  }
};
export const agregarParroquia = async (item) => {
  try {
    const newParroquia = new ParroquiaModel(item);
    await newParroquia.save();
    return {
      result: newParroquia,
      error: false,
      msg: "Agregado con exito!",
    };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      msg: String(error) || "Hubo un error al editar la parroquia",
    };
  }
};
export const editarParroquia = async (item) => {
  try {
    const response = await ParroquiaModel.findOneAndUpdate(
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
      msg: String(error) || "Hubo un error al editar la parroquia",
    };
  }
};

export const eliminarParroquia = async (item) => {
  try {
    const usado = await ConfirmacionModel.findOne({
      $or: [
        { "parroquiaBustismo._id": item._id },
        { "parroquiaConfirmacion._id": item._id },
      ],
    });
    if (usado) {
      return { error: true, msg: "No se puede eliminar: esta parroquia está asociada a una o más confirmaciones" };
    }
    await ParroquiaModel.deleteOne(item);
    return { error: false, msg: "Eliminado con exito!" };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      msg: String(error) || "Hubo un error al eliminar la parroquia",
    };
  }
};
