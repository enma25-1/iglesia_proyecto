import { response, request } from "express";
import { DistritoModel } from "../../models";
import mongoose from "mongoose";

export const getDistritos = async (req = request, res = response) => {
  try {
    const {
      pagination: { page, limit },
      sort: { campo, asc },
      busqueda,
      depto,
      municipio,
    } = req.body;

    const matchConditions = [
      { name: new RegExp(busqueda, "i") },
      { depto: new mongoose.Types.ObjectId(depto) },
    ];

    if (municipio) {
      matchConditions.push({ municipio: new mongoose.Types.ObjectId(municipio) });
    }

    const aggregation = DistritoModel.aggregate([
      {
        $match: {
          $and: matchConditions,
        },
      },
      {
        $lookup: {
          from: "municipios",
          localField: "municipio",
          foreignField: "_id",
          as: "municipioData",
        },
      },
      {
        $addFields: {
          municipioNombre: { $arrayElemAt: ["$municipioData.name", 0] },
        },
      },
      {
        $project: {
          depto: true,
          _id: true,
          name: true,
          municipio: true,
          municipioNombre: true,
        },
      },
      {
        $sort: {
          [campo]: asc ? 1 : -1,
        },
      },
    ]);

    const result = await DistritoModel.aggregatePaginate(aggregation, {
      page,
      limit,
    });

    res.status(200).json({ result });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      error: true,
      msg: String(error) || "Hubo un error al obtener los distritos",
    });
  }
};

export const searchDistritosByDepto = async (
  req = request,
  res = response
) => {
  const { deptoId, municipioId, search } = req.body;
  try {
    if (!deptoId) {
      return res.status(200).json([]);
    }

    const query = {
      depto: deptoId,
      name: new RegExp(search, "i"),
    };

    if (municipioId) {
      query.municipio = municipioId;
    }

    const data = await DistritoModel.find(query)
      .select(["name"])
      .limit(15);

    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: true,
      msg: String(error) || "Hubo un error al obtener los distritos",
    });
  }
};

export const agregarDistrito = async (item) => {
  try {
    const newDistrito = new DistritoModel(item);
    await newDistrito.save();
    return { item: newDistrito, error: false };
  } catch (error) {
    return { error: true, msg: String(error) || "error al agregar distrito" };
  }
};

export const editarDistrito = async (item) => {
  try {
    await DistritoModel.findOneAndUpdate({ _id: item._id }, item, {
      new: true,
    });
    return { error: false };
  } catch (error) {
    console.log({ error });
    return { error: true, msg: String(error) || "error al editar distrito" };
  }
};

export const eliminarDistrito = async (item) => {
  try {
    await DistritoModel.findOneAndDelete(item);
    return { error: false };
  } catch (error) {
    return { error: true, msg: String(error) || "error al eliminar distrito" };
  }
};
