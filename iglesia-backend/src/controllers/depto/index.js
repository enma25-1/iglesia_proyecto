import { DeptoModel } from "../../models";

export const getDeptos = async (req, res = response) => {
  try {
    const {
      pagination: { page, limit },
      sort: { campo, asc },
      busqueda,
    } = req.body;
    // const aggregation = DeptoModel.aggregate([
    //   {
    //     $lookup: {
    //       from: "municipios",
    //       let: { depto_id: "$_id" },
    //       pipeline: [
    //         {
    //           $match: {
    //             $expr: {
    //               $and: [
    //                 { $eq: ["$depto", "$$depto_id"] },
    //                 {
    //                   $or: [
    //                     // Busca por el nombre del municipio
    //                     {
    //                       $regexMatch: {
    //                         input: "$name",
    //                         regex: new RegExp(busqueda, "i"),
    //                       },
    //                     },
    //                   ],
    //                 },
    //               ],
    //             },
    //           },
    //         },
    //         {
    //           $project: {
    //             _id: 1,
    //             // name: 1,
    //             // depto: 1,
    //           },
    //         },
    //         // {
    //         //   $sort: {
    //         //     name: -1, // 1 para ascendente, -1 para descendente
    //         //   },
    //         // },
    //       ],
    //       as: "filteredMunicipios",
    //     },
    //   },
    //   {
    //     $project: {
    //       totalMunicipios: { $size: "$filteredMunicipios" },
    //       _id: true,
    //       name: true,
    //       // filteredMunicipios: -1,
    //     },
    //   },
    //   {
    //     $match: {
    //       $or: [
    //         // Busca por el nombre del departamento
    //         { name: new RegExp(busqueda, "i") },
    //         // Si totalMunicipios > 0, incluye el departamento
    //         { totalMunicipios: { $gt: 0 } },
    //       ],
    //     },
    //   },
    //   {
    //     $sort: {
    //       name: 1, // 1 para ascendente, -1 para descendente
    //     },
    //   },
    // ]);

    // const result = await DeptoModel.aggregatePaginate(aggregation, {
    //   page,
    //   limit,
    // });
    // retrn res.status(200).json({ result });
    const aggregation = DeptoModel.aggregate([
      {
        $match: {
          $or: [
            // Busca por el nombre del departamento
            { name: new RegExp(busqueda, "i") },
            // Si totalMunicipios > 0, incluye el departamento
          ],
        },
      },

      {
        $lookup: {
          from: "municipios",
          localField: "_id",
          foreignField: "depto",
          as: "filteredMunicipios",
        },
      },

      {
        $project: {
          totalMunicipios: { $size: "$filteredMunicipios" },
          _id: true,
          name: true,
          // filteredMunicipios: -1,
        },
      },
      {
        $sort: {
          [campo]: asc ? 1 : -1, // 1 para ascendente, -1 para descendente
        },
      },
    ]);

    const result = await DeptoModel.aggregatePaginate(aggregation, {
      page,
      limit,
    });

    res.status(200).json({ result });
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      error: true,
      msg: "Hubo un error al obtener los departamentos",
    });
  }
};
export const searchDepto = async (req, res = response) => {
  const { search } = req.body;
  try {
    const response = await DeptoModel.find({ name: new RegExp(search, "i") })
      .select(["name"]) // Excluye la propiedad __v
      .limit(30);
    res.status(200).json(response);
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      error: true,
      msg: "Hubo un error al obtener los departamentos",
    });
  }
};

// SOCKET
export const agregarDepto = async (item) => {
  try {
    const newDepto = new DeptoModel(item);
    await newDepto.save();
    return { item: newDepto, error: false };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      msg: String(error) || "Hubo un error al crear el depto",
    };
  }
};

export const editarDepto = async (item) => {
  try {
    await DeptoModel.findOneAndUpdate({ _id: item._id }, item, { new: true });
    return { error: false };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      msg: String(error) || "Hubo un error al actualizar el depto",
    };
  }
};

export const eliminarDepto = async (item) => {
  try {
    await DeptoModel.findOneAndDelete(item);
    return { error: false };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      msg: String(error) || "Hubo un error al eliminar el depto",
    };
  }
};
