// Municipios
import { response, request } from "express";
import { MunicipioModel } from "../../models";
import mongoose from "mongoose";

export const getMunicipios = async (req = request, res = response) => {
  try {
    const {
      pagination: { page, limit },
      sort: { campo, asc },
      busqueda,
      depto,
    } = req.body;

    const matchConditions = [
      { name: new RegExp(busqueda, "i") },
      { depto: new mongoose.Types.ObjectId(depto) },
    ];

    const aggregation = MunicipioModel.aggregate([
      {
        $match: {
          $and: matchConditions,
        },
      },
      {
        $project: {
          depto: true,
          _id: true,
          name: true,
        },
      },
      {
        $sort: {
          [campo]: asc ? 1 : -1,
        },
      },
    ]);

    const result = await MunicipioModel.aggregatePaginate(aggregation, {
      page,
      limit,
    });

    res.status(200).json({ result });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      error: true,
      msg: String(error) || "Hubo un error al obtener los municipios",
    });
  }
};

export const searchMunicipiosByDepto = async (
  req = request,
  res = response
) => {
  const { deptoId, search } = req.body;
  try {
    if (!deptoId) {
      return res.status(200).json([]);
    }

    const data = await MunicipioModel.find({
      depto: deptoId,
      name: new RegExp(search, "i"),
    })
      .select(["name"])
      .limit(15);

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: true,
      msg: String(error) || "Hubo un error al obtener los municipios",
    });
  }
};

// SOCKET
export const agregarMunicipio = async (item) => {
  try {
    const newMunicipio = new MunicipioModel(item);
    await newMunicipio.save();
    return { item: newMunicipio, error: false };
  } catch (error) {
    return { error: true, msg: String(error) || "error al agregar municipio" };
  }
};

export const editarMunicipio = async (item) => {
  try {
    await MunicipioModel.findOneAndUpdate({ _id: item._id }, item, {
      new: true,
    });
    return { error: false };
  } catch (error) {
    console.log({ error });
    return { error: true, msg: String(error) || "error al editar municipio" };
  }
};

export const eliminarMunicipio = async (item) => {
  try {
    await MunicipioModel.findOneAndDelete(item);
    return { error: false };
  } catch (error) {
    return { error: true, msg: String(error) || "error al eliminar municipio" };
  }
};
