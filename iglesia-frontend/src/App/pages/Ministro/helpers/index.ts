import { clienteAxios } from "../../../../api";
import {
  Column,
  ErrorBackend,
  Pagination,
} from "../../../../interfaces/global";
import { paginationDefault } from "../../../../helpers/const";
import {
  MinistroForeign,
  MinistroItem,
  OrdenMinisterial,
  setDataProps,
} from "../interfaces";
import { formatMunicipioForeign } from "../../Depto/components/Municipio/helpers";
import { formatDeptoForeign } from "../../Depto";
import { formatDistritoForeign } from "../../Depto/components/Distrito/helpers";
export enum SocketOnMinistro {
  agregar = "cliente:ministro-agregar",
  editar = "cliente:ministro-editar",
  eliminar = "cliente:ministro-eliminar",
  municipioListener = "cliente:ministro-municipio-listener",
}

export enum SocketEmitMinistro {
  agregar = "server:ministro-agregar",
  editar = "server:ministro-editar",
  eliminar = "server:ministro-eliminar",
}

export const columns: Column[] = [
  { campo: "", label: "", minWidth: 10, align: "center", sortable: false },
  {
    campo: "orden.abreviatura",
    label: "Orden",
    minWidth: 80,
    sortable: false,
    required: false,
  },
  {
    campo: "name",
    label: "Ministro",
    minWidth: 175,
    sortable: true,
    required: true,
  },
  {
    campo: "depto.name",
    label: "Departamento",
    minWidth: 140,
    sortable: true,
    required: true,
  },
  {
    campo: "municipio.name",
    label: "Municipio",
    minWidth: 140,
    sortable: true,
    required: true,
  },
  {
    campo: "distrito.name",
    label: "Distrito",
    minWidth: 140,
    sortable: true,
    required: true,
  },
];
export const sortDefault = { asc: true, campo: "name" };

export const itemDefault: MinistroItem = {
  estado: false,
  municipio: formatMunicipioForeign(),
  distrito: formatDistritoForeign(),
  depto: formatDeptoForeign(),
  name: "",
  orden: { name: "", abreviatura: "" },
};
interface ResultMinistros extends Pagination {
  docs: MinistroItem[];
}

type getMinistrosType = (arg: setDataProps) => Promise<{
  error: ErrorBackend;
  result: ResultMinistros;
}>;

export const getMinistros: getMinistrosType = async ({
  busqueda,
  pagination,
  sort,
}: setDataProps) => {
  try {
    const { data } = await clienteAxios.post<ResultMinistros>("/ministro", {
      pagination,
      sort,
      busqueda,
    });

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
  result?: MinistroItem;
}

// AGREGAR PARROQUIA
export const agregarMinistro = async (
  item: MinistroItem,
): Promise<ApiResponseCU> => {
  try {
    const { data } = await clienteAxios.post<ApiResponseCU>(
      "/ministro/add",
      item,
    );
    console.log({ data });
    return data;
  } catch (error: any) {
    console.log({ error });
    return {
      error: true,
      msg: error?.response?.data?.msg || "Hubo un error al agregar la ministro",
    };
  }
};

// EDITAR PARROQUIA
export const editarMinistro = async (
  item: MinistroItem,
): Promise<ApiResponseCU> => {
  try {
    console.log({ item });

    const { data } = await clienteAxios.put<ApiResponseCU>(
      "/ministro/edit",
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
        "Hubo un error al editar la ministroasdasd",
    };
  }
};

// ELIMINAR PARROQUIA
export const eliminarMinistro = async (item: {
  _id: string;
}): Promise<ErrorBackend> => {
  try {
    const { data } = await clienteAxios.delete<ErrorBackend>(
      "/ministro/delete",
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
        error?.response?.data?.msg || "Hubo un error al eliminar la ministro",
    };
  }
};
export const formatMinistroForeign: (
  ministro?: MinistroItem,
) => MinistroForeign = (ministro?: MinistroItem) => {
  return ministro
    ? {
        _id: ministro._id,
        name: ministro.name,
        estado: ministro.estado,
        orden: ministro.orden,
      }
    : {
        estado: false,
        name: "",
        orden: { name: "", abreviatura: "" },
      };
};

export const getMinistroDisplayName = (
  ministro: { name: string; orden?: OrdenMinisterial } | undefined,
): string => {
  if (!ministro) return "";
  const abrev = ministro.orden?.abreviatura;
  return abrev ? `${abrev} ${ministro.name}` : ministro.name;
};
