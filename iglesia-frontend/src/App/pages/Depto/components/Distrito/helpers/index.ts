import { clienteAxios } from "../../../../../../api";
import {
  Column,
  ErrorBackend,
  Pagination,
} from "../../../../../../interfaces/global";
import { paginationDefault } from "../../../../../../helpers";
import { DistritoForeign, DistritoItem, setDataProps } from "../interfaces";

export enum SocketOnDistrito {
  agregar = "cliente:distrito-agregar",
  editar = "cliente:distrito-editar",
  eliminar = "cliente:distrito-eliminar",
}

export enum SocketEmitDistrito {
  agregar = "server:distrito-agregar",
  editar = "server:distrito-editar",
  eliminar = "server:distrito-eliminar",
}

export const columns: Column[] = [
  { campo: "", label: "", minWidth: 50, align: "center", sortable: false },
  {
    campo: "name",
    label: "Nombre",
    required: true,
    minWidth: 40,
    sortable: true,
  },
  {
    campo: "municipioNombre",
    label: "Municipio",
    minWidth: 40,
    sortable: false,
  },
];
export const sortDefault = { asc: true, campo: "name" };

export const itemDefault: DistritoItem = {
  depto: "",
  name: "",
};

interface Result extends Pagination {
  docs: DistritoItem[];
}

interface MyResponse {
  data: { result: Result };
}

type getDistritosType = (arg: setDataProps) => Promise<{
  error: ErrorBackend;
  result: Result;
}>;

export const getDistritos: getDistritosType = async ({
  busqueda,
  depto,
  municipio,
  pagination,
  sort,
}: setDataProps) => {
  try {
    const data: MyResponse = await clienteAxios.post("/distrito", {
      pagination,
      sort,
      busqueda,
      depto,
      municipio,
    });

    return {
      error: {
        error: false,
        msg: "",
      },
      result: data.data.result,
    };
  } catch (error: any) {
    console.log({error});
    
    const errorResult = {
      msg: error?.response?.data?.msg || "Error al consultar los distritos",
      error: true,
    };
    return { error: errorResult, result: { docs: [], ...paginationDefault } };
  }
};

export const formatDistritoForeign: (distrito?: DistritoItem) => DistritoForeign = (
  distrito?: DistritoItem
) => {
  return distrito
    ? {
        _id: distrito._id,
        name: distrito.name,
      }
    : {
        name: "",
      };
};
