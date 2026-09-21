import { clienteAxios } from "../../../../api";
import {
  Column,
  ErrorBackend,
  Pagination,
} from "../../../../interfaces/global";
import { paginationDefault } from "../../../../helpers/const";
import { ConfirmacionItem, setDataProps } from "../interfaces";
import { formatParroquiaForeign } from "../../Parroquia";
import { formatMinistroForeign } from "../../Ministro";
export enum SocketOnConfirmacion {
  agregar = "cliente:confirmacion-agregar",
  editar = "cliente:confirmacion-editar",
  eliminar = "cliente:confirmacion-eliminar",
  municipioListener = "cliente:confirmacion-municipio-listener",
}

export enum SocketEmitConfirmacion {
  agregar = "server:confirmacion-agregar",
  editar = "server:confirmacion-editar",
  eliminar = "server:confirmacion-eliminar",
}

export const columns: Column[] = [
  { campo: "", label: "", minWidth: 10, align: "center", sortable: false },
  // {
  //   campo: "municipio.name",
  //   label: "Departamento",
  //   minWidth: 175,
  //   sortable: true,
  //   required: true,
  // },
  {
    campo: "apellidos",
    label: "apellidos",
    minWidth: 175,
    sortable: true,
    required: true,
  },
  {
    campo: "nombres",
    label: "nombres",
    minWidth: 175,
    sortable: true,
    required: true,
  },
  {
    campo: "edad",
    label: "edad",
    minWidth: 175,
    sortable: true,
    required: true,
  },
  {
    campo: "parroquiaBustismo.name",
    label: "Parroquia B.",
    minWidth: 175,
    sortable: true,
    required: true,
  },
  {
    campo: "parroquiaConfirmacion.name",
    label: "Parroquia C.",
    minWidth: 175,
    sortable: true,
    required: true,
  },
  {
    campo: "ministro.name",
    label: "ministro",
    minWidth: 175,
    sortable: true,
    required: true,
  },
  {
    campo: "padre",
    label: "padre",
    minWidth: 175,
    sortable: true,
    required: true,
  },
  {
    campo: "madre",
    label: "madre",
    minWidth: 175,
    sortable: true,
    required: true,
  },
  {
    campo: "padrino",
    label: "padrino",
    minWidth: 175,
    sortable: true,
    required: true,
  },
  {
    campo: "madrina",
    label: "madrina",
    minWidth: 175,
    sortable: true,
    required: true,
  },
  {
    campo: "fecha",
    label: "fecha",
    minWidth: 175,
    sortable: true,
    required: true,
  },
  {
    campo: "observacion",
    label: "Observación",
    minWidth: 175,
    sortable: false,
    required: false,
  },
];
export const sortDefault = { asc: true, campo: "name" };

// Definición del objeto por defecto para un nuevo departamento.
export const itemDefault: ConfirmacionItem = {
  apellidos: "",
  nombres: "",
  edad: "",
  parroquiaBustismo: formatParroquiaForeign(),
  parroquiaConfirmacion: formatParroquiaForeign(),
  ministro: formatMinistroForeign(),
  ministroConfirma: formatMinistroForeign(),
  padre: "",
  madre: "",
  padrino: "",
  madrina: "",
  fecha: "",
  createdAt: "",
  updatedAt: "",
  folio: 0,
  libro: 0,
  observacion: "",
  tipo: "normal",
  // crud: Crud,
  // municipio: formatMunicipioForeign(),
  // depto: formatDeptoForeign(),
  // name: "",
};
interface ResultConfirmaciones extends Pagination {
  docs: ConfirmacionItem[];
}

type getConfirmacionesType = (arg: setDataProps) => Promise<{
  error: ErrorBackend;
  result: ResultConfirmaciones;
}>;

export const getConfirmaciones: getConfirmacionesType = async ({
  busqueda,
  pagination,
  sort,
  busquedaAvanzada,
}: setDataProps) => {
  try {
    console.log({ busquedaAvanzada });

    const { data } = await clienteAxios.post<ResultConfirmaciones>(
      "/confirmacion",
      {
        pagination,
        sort,
        busqueda,
        busquedaAvanzada,
      },
    );

    return {
      error: {
        error: false,
        msg: "",
      },
      result: data,
    };
  } catch (error: any) {
    const errorResult = {
      msg: error?.response?.data?.msg || "Error al consultar los departamentos",
      error: true,
    };
    return { error: errorResult, result: { docs: [], ...paginationDefault } };
  }
};

interface ApiResponseCU extends ErrorBackend {
  result?: ConfirmacionItem;
}

// AGREGAR PARROQUIA
export const agregarConfirmacion = async (
  item: ConfirmacionItem,
): Promise<ApiResponseCU> => {
  try {
    const { data } = await clienteAxios.post<ApiResponseCU>(
      "/confirmacion/add",
      item,
    );
    console.log({ data });
    return data;
  } catch (error: any) {
    console.log({ error });
    return {
      error: true,
      msg:
        error?.response?.data?.msg ||
        "Hubo un error al agregar la confirmacion",
    };
  }
};

// EDITAR PARROQUIA
export const editarConfirmacion = async (
  item: ConfirmacionItem,
): Promise<ApiResponseCU> => {
  try {
    console.log({ item });

    const { data } = await clienteAxios.put<ApiResponseCU>(
      "/confirmacion/edit",
      item,
    );
    console.log({ data });

    return data;
  } catch (error: any) {
    console.log({ error });

    return {
      error: true,
      msg:
        error?.response?.data?.msg ||
        "Hubo un error al editar la confirmacionasdasd",
    };
  }
};

// ELIMINAR PARROQUIA
export const eliminarConfirmacion = async (item: {
  _id: string;
}): Promise<ErrorBackend> => {
  try {
    const { data } = await clienteAxios.delete<ErrorBackend>(
      "/confirmacion/delete",
      {
        data: item,
      },
    );
    console.log({ data });

    return data;
  } catch (error: any) {
    console.log({ error });

    return {
      error: true,
      msg:
        error?.response?.data?.msg ||
        "Hubo un error al eliminar la confirmacion",
    };
  }
};
