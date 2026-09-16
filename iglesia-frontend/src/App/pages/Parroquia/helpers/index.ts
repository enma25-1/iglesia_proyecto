import { clienteAxios } from "../../../../api";
import {
  Column,
  ErrorBackend,
  Pagination,
} from "../../../../interfaces/global";
import { paginationDefault } from "../../../../helpers/const";
import { ParroquiaForeign, ParroquiaItem, setDataProps } from "../interfaces";
import { formatDeptoForeign } from "../../Depto";
import { formatMunicipioForeign } from "../../Depto/components/Municipio/helpers";
import { formatDistritoForeign } from "../../Depto/components/Distrito/helpers";
export enum SocketOnParroquia {
  agregar = "cliente:parroquia-agregar",
  editar = "cliente:parroquia-editar",
  eliminar = "cliente:parroquia-eliminar",
  municipioListener = "cliente:parroquia-municipio-listener",
}

export enum SocketEmitParroquia {
  agregar = "server:parroquia-agregar",
  editar = "server:parroquia-editar",
  eliminar = "server:parroquia-eliminar",
}

export const columns: Column[] = [
  { campo: "", label: "", minWidth: 10, align: "center", sortable: false },
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
  {
    campo: "name",
    label: "Nombre",
    minWidth: 175,
    sortable: true,
    required: true,
  },
  {
    campo: "direccion",
    label: "Dirección",
    minWidth: 200,
    sortable: true,
    required: true,
  },
];
export const sortDefault = { asc: true, campo: "name" };

export const itemDefault: ParroquiaItem = {
  direccion: "",
  estado: true,
  municipio: formatMunicipioForeign(),
  distrito: formatDistritoForeign(),
  depto: formatDeptoForeign(),
  name: "",
};
interface ResultParroquias extends Pagination {
  docs: ParroquiaItem[];
}

type getParroquiasType = (arg: setDataProps) => Promise<{
  error: ErrorBackend;
  result: ResultParroquias;
}>;

export const getParroquias: getParroquiasType = async ({
  busqueda,
  pagination,
  sort,
}: setDataProps) => {
  try {
    const { data } = await clienteAxios.post<ResultParroquias>("/parroquia", {
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
  result?: ParroquiaItem;
}

// AGREGAR PARROQUIA
export const agregarParroquia = async (
  item: ParroquiaItem
): Promise<ApiResponseCU> => {
  try {
    const { data } = await clienteAxios.post<ApiResponseCU>(
      "/parroquia/add",
      item
    );
    console.log({ data });
    return data;
  } catch (error: any) {
    console.log({ error });
    return {
      error: true,
      msg:
        error?.response?.data?.msg || "Hubo un error al agregar la parroquia",
    };
  }
};

// EDITAR PARROQUIA
export const editarParroquia = async (
  item: ParroquiaItem
): Promise<ApiResponseCU> => {
  try {
    console.log({ item });

    const { data } = await clienteAxios.put<ApiResponseCU>(
      "/parroquia/edit",
      item
    );
    console.log({ data });

    return data;
  } catch (error: any) {
    console.log({ error });

    return {
      error: true,
      msg:
        error?.response?.data?.msg ||
        "Hubo un error al editar la parroquiaasdasd",
    };
  }
};

// ELIMINAR PARROQUIA
export const eliminarParroquia = async (item: {
  _id: string;
}): Promise<ErrorBackend> => {
  try {
    const { data } = await clienteAxios.delete<ErrorBackend>(
      "/parroquia/delete",
      {
        data: item,
      }
    );
    console.log({ data });

    return data;
  } catch (error: any) {
    console.log({ error });

    return {
      error: true,
      msg:
        error?.response?.data?.msg || "Hubo un error al eliminar la parroquia",
    };
  }
};
export const formatParroquiaForeign: (
  parroquia?: ParroquiaItem
) => ParroquiaForeign = (parroquia?: ParroquiaItem) => {
  return parroquia
    ? {
        _id: parroquia._id,
        name: parroquia.name,
        direccion: parroquia.direccion,
      }
    : {
        direccion: "",
        name: "",
      };
};
