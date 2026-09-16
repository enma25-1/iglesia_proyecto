import { clienteAxios } from "../../../../api";
import {
  Column,
  ErrorBackend,
  Pagination,
} from "../../../../interfaces/global";
import { paginationDefault } from "../../../../helpers/const";
import { DeptoForeign, DeptoItem, setDataProps } from "../interfaces";
export enum SocketOnDepto {
  agregar = "cliente:depto-agregar",
  editar = "cliente:depto-editar",
  eliminar = "cliente:depto-eliminar",
  municipioListener = "cliente:depto-municipio-listener",
}

export enum SocketEmitDepto {
  agregar = "server:depto-agregar",
  editar = "server:depto-editar",
  eliminar = "server:depto-eliminar",
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
    campo: "totalMunicipios",
    label: "Distritos",
    minWidth: 40,
    sortable: true,
  },
];
export const sortDefault = { asc: true, campo: "name" };

// Definición del objeto por defecto para un nuevo departamento.
export const itemDefault: DeptoItem = {
  name: "",
};
interface Result extends Pagination {
  docs: DeptoItem[];
}

interface MyResponse {
  data: { result: Result };
}

type getDeptosType = (arg: setDataProps) => Promise<{
  error: ErrorBackend;
  result: Result;
}>;

export const getDeptos: getDeptosType = async ({
  busqueda,
  pagination,
  sort,
}: setDataProps) => {
  try {
    const {
      data: { result },
    }: MyResponse = await clienteAxios.post("/depto", {
      pagination: { ...pagination, limit: 14 },
      sort,
      busqueda,
    });

    console.log({ result });

    return {
      error: {
        error: false,
        msg: "",
      },
      result,
    };
  } catch (error: any) {
    const errorResult = {
      msg: error?.response?.data?.msg || "Error al consultar los departamentos",
      error: true,
    };
    return { error: errorResult, result: { docs: [], ...paginationDefault } };
  }
};

export const formatDeptoForeign: (depto?: DeptoItem) => DeptoForeign = (
  depto?: DeptoItem
) => {
  return depto
    ? {
        _id: depto._id,
        name: depto.name,
      }
    : {
        // _id: '',
        name: "",
      };
};
