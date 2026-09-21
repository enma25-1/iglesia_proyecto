import { ConfirmacionModel } from "../../models/Confirmacion";
import { ObjectId } from "mongodb";

export const getConfirmaciones = async (req, res = response) => {
  try {
    const {
      pagination: { page, limit },
      sort: { campo, asc },
      busqueda,
      busquedaAvanzada = {},
    } = req.body;

    // Construir condiciones de búsqueda simple
    const matchConditions = {
      $or: [
        { apellidos: new RegExp(busqueda, "i") },
        { nombres: new RegExp(busqueda, "i") },
        { padre: new RegExp(busqueda, "i") },
        { madre: new RegExp(busqueda, "i") },
        { padrino: new RegExp(busqueda, "i") },
        { madrina: new RegExp(busqueda, "i") },
        { observacion: new RegExp(busqueda, "i") },
      ],
    };

    // Agregar filtros de búsqueda avanzada
    if (busquedaAvanzada && Object.keys(busquedaAvanzada).length > 0) {
      const advancedFilters = [];

      // Filtro por fechas (rango o individual)
      if (busquedaAvanzada.fecha1 || busquedaAvanzada.fecha2) {
        const fechaFilter = {};

        if (busquedaAvanzada.fecha1 && busquedaAvanzada.fecha2) {
          // Si van las dos fechas, buscar por rango
          fechaFilter.$gte = new Date(busquedaAvanzada.fecha1);
          fechaFilter.$lte = new Date(busquedaAvanzada.fecha2);
        } else if (busquedaAvanzada.fecha1) {
          // Si solo fecha1, buscar registros de ese día
          const fecha1 = new Date(busquedaAvanzada.fecha1);
          const fecha1End = new Date(busquedaAvanzada.fecha1);
          fecha1End.setHours(23, 59, 59, 999);
          fechaFilter.$gte = fecha1;
          fechaFilter.$lte = fecha1End;
        } else if (busquedaAvanzada.fecha2) {
          // Si solo fecha2, buscar registros de ese día
          const fecha2 = new Date(busquedaAvanzada.fecha2);
          const fecha2End = new Date(busquedaAvanzada.fecha2);
          fecha2End.setHours(23, 59, 59, 999);
          fechaFilter.$gte = fecha2;
          fechaFilter.$lte = fecha2End;
        }

        advancedFilters.push({ fecha: fechaFilter });
      }

      // Filtro por parroquia de bautismo
      if (busquedaAvanzada.parroquiaBautismo) {
        advancedFilters.push({
          "parroquiaBustismo._id": new ObjectId(
            busquedaAvanzada.parroquiaBautismo,
          ),
        });
      }

      // Filtro por parroquia de confirmación
      if (busquedaAvanzada.parroquiaConfirmacion) {
        advancedFilters.push({
          "parroquiaConfirmacion._id": new ObjectId(
            busquedaAvanzada.parroquiaConfirmacion,
          ),
        });
      }

      // Filtro por tipo de confirma (normal / supletoria). Los registros
      // creados antes de agregar este campo no tienen "tipo" guardado, por
      // lo que se consideran "normal" también.
      if (busquedaAvanzada.tipo) {
        advancedFilters.push(
          busquedaAvanzada.tipo === "normal"
            ? { $or: [{ tipo: "normal" }, { tipo: { $exists: false } }] }
            : { tipo: busquedaAvanzada.tipo },
        );
      }

      // Combinar búsqueda simple con filtros avanzados
      if (advancedFilters.length > 0) {
        matchConditions.$and = [
          { $or: matchConditions.$or },
          ...advancedFilters,
        ];
        delete matchConditions.$or;
      }
    }

    const aggregation = ConfirmacionModel.aggregate([
      {
        $match: matchConditions,
      },
      {
        $sort: {
          [campo]: asc ? 1 : -1,
        },
      },
    ]);

    const result = await ConfirmacionModel.aggregatePaginate(aggregation, {
      page,
      limit,
    });

    res.status(200).json(result);
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      error: true,
      msg: String(error) || "Hubo un error al obtener las confirmaciones",
    });
  }
};

export const checkDuplicateConfirmacion = async (item) => {
  try {
    const conditions = [
      { nombres: item.nombres },
      { apellidos: item.apellidos },
    ];

    if (item._id) {
      conditions.push({ _id: { $ne: item._id } });
    }

    const parentConditions = [];
    if (item.padre) parentConditions.push({ padre: item.padre });
    if (item.madre) parentConditions.push({ madre: item.madre });
    if (parentConditions.length > 0) {
      conditions.push({ $or: parentConditions });
    }

    const godparentConditions = [];
    if (item.padrino) godparentConditions.push({ padrino: item.padrino });
    if (item.madrina) godparentConditions.push({ madrina: item.madrina });
    if (godparentConditions.length > 0) {
      conditions.push({ $or: godparentConditions });
    }

    const duplicates = await ConfirmacionModel.find({
      $and: conditions,
    }).lean();

    return {
      error: false,
      duplicates,
      hasDuplicate: duplicates.length > 0,
    };
  } catch (error) {
    return {
      error: true,
      duplicates: [],
      hasDuplicate: false,
      msg: String(error) || "Error al verificar duplicados",
    };
  }
};

// CRUD
export const agregarConfirmacion = async (item) => {
  try {
    if (!item.padre && !item.madre) {
      return { error: true, msg: "Debe ingresar al menos el padre o la madre" };
    }
    if (!item.padrino && !item.madrina) {
      return {
        error: true,
        msg: "Debe ingresar al menos el padrino o la madrina",
      };
    }
    const newConfirmacion = new ConfirmacionModel(item);

    await newConfirmacion.save();
    return {
      result: newConfirmacion,
      error: false,
      msg: "Agregado con exito!",
    };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      msg: String(error) || "Hubo un error al editar la confirmacion",
    };
  }
};
export const editarConfirmacion = async (item) => {
  try {
    if (!item.padre && !item.madre) {
      return { error: true, msg: "Debe ingresar al menos el padre o la madre" };
    }
    if (!item.padrino && !item.madrina) {
      return { error: true, msg: "Debe ingresar al menos el padrino o la madrina" };
    }
    const { _id, __v, crud, createdAt, updatedAt, ...updateData } = item;
    const response = await ConfirmacionModel.findOneAndUpdate(
      { _id },
      updateData,
      { new: true, strict: false },
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
      msg: String(error) || "Hubo un error al editar la confirmacion",
    };
  }
};

export const eliminarConfirmacion = async (item) => {
  try {
    await ConfirmacionModel.deleteOne(item);
    return { error: false, msg: "Eliminado con exito!" };
  } catch (error) {
    console.log({ error });
    return {
      error: true,
      msg: String(error) || "Hubo un error al eliminar la confirmacion",
    };
  }
};
