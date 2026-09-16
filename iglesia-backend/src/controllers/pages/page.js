import { response } from "express";
import { PageModel, RolModel } from "../../models";

export const getPages = async (req, res = response) => {
  try {
    // "Page", "Producto", "Depto", "Usuario", 'Parroquia, "Ministro";
    // const pagesA = ['Confirmacion'];
    // pagesA.forEach(async (page) => {
    //   const newPage = new PageModel({
    //     componente: page,
    //     nombre: page,
    //     icono: "Page",
    //     orden: 1,
    //     delete: ["GERENTE"],
    //     update: ["GERENTE"],
    //     insert: ["GERENTE"],
    //     select: ["GERENTE"],
    //     ver: ["GERENTE"],
    //     rUsuario: { _id: "686af8da0f28ec30033adc41" },
    //   });
    //   await newPage.save();
    // });

    const pages = await PageModel.find()
      .populate({
        path: "rUsuario",
        select: ["_id", "dui", "name", "lastname"], // selecciona sólo el campo 'name' y excluye el campo '_id'
      })
      .populate({
        path: "eUsuario",
        select: ["_id", "dui", "name", "lastname"], // selecciona sólo el campo 'name' y excluye el campo '_id'
      })
      .sort("nombre");
    // sel ;
    res.status(200).json({
      data: pages,
    });
  } catch (error) {
    console.log({ error });
    res.status(500).json({
      error: true,
      msg: String(error) || "Hubo un error al obtener las pages",
    });
  }
};
