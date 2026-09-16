import { clienteAxios } from "../../../../api";
import {
  Column,
  ErrorBackend,
  Pagination,
} from "../../../../interfaces/global";
import { paginationDefault } from "../../../../helpers/const";
import { UsuarioItem, setDataProps } from "../interfaces";
export enum SocketOnUsuario {
  agregar = "cliente:usuario-agregar",
  editar = "cliente:usuario-editar",
  eliminar = "cliente:usuario-eliminar",
  municipioListener = "cliente:usuario-municipio-listener",
}

export enum SocketEmitUsuario {
  agregar = "server:usuario-agregar",
  editar = "server:usuario-editar",
  eliminar = "server:usuario-eliminar",
}

export const columns: Column[] = [
  { campo: "", label: "", minWidth: 10, align: "center", sortable: false },
  {
    campo: "online",
    label: "online",
    align: "center",
    minWidth: 25,
    sortable: true,
    required: false,
  },
  {
    campo: "lastname",
    label: "Nombre",
    minWidth: 175,
    sortable: true,
    required: false,
  },
  {
    campo: "username",
    label: "Usuario",
    minWidth: 175,
    sortable: true,
    required: false,
  },

  {
    campo: "tel",
    label: "tel",
    minWidth: 175,
    sortable: false,
    required: false,
  },
  {
    campo: "createdAt",
    label: "Fec. Reg.",
    minWidth: 175,
    sortable: true,
    required: false,
  },
];
export const sortDefault = { asc: true, campo: "name" };

// Definición del objeto por defecto para un nuevo departamento.
export const itemDefault: UsuarioItem = {
  username: "",
  lastname: "",
  name: "",
  online: false,
  photo: "",
  tel: "",
  rol: "ADMINISTRATIVO",
  estado: true,
  createdAt: "",
  updatedAt: "",
};
interface ResultUsuarios extends Pagination {
  docs: UsuarioItem[];
}

type getUsuariosType = (arg: setDataProps) => Promise<{
  error: ErrorBackend;
  result: ResultUsuarios;
}>;

export const getUsuarios: getUsuariosType = async (params: setDataProps) => {
  try {
    console.log({ params });

    const { data } = await clienteAxios.post<ResultUsuarios>(
      "/usuario",
      params,
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
  result?: UsuarioItem;
}

// AGREGAR PARROQUIA
export const agregarUsuario = async (
  item: UsuarioItem,
): Promise<ApiResponseCU> => {
  try {
    const { data } = await clienteAxios.post<ApiResponseCU>(
      "/usuario/add",
      item,
    );
    console.log({ data });
    return data;
  } catch (error: any) {
    console.log({ error });
    return {
      error: true,
      msg: error?.response?.data?.msg || "Hubo un error al agregar la usuario",
    };
  }
};

// EDITAR PARROQUIA
export const editarUsuario = async (
  item: UsuarioItem,
  eliminados: string[],
): Promise<ApiResponseCU> => {
  try {
    console.log({ item });

    const { data } = await clienteAxios.put<ApiResponseCU>("/usuario/edit", {
      data: item,
      eliminados,
    });
    console.log({ data });

    return data;
  } catch (error: any) {
    console.log({ error });

    return {
      error: true,
      msg:
        error?.response?.data?.msg ||
        "Hubo un error al editar la usuarioasdasd",
    };
  }
};

// ELIMINAR PARROQUIA
export const eliminarUsuario = async (item: {
  _id: string;
}): Promise<ErrorBackend> => {
  try {
    const { data } = await clienteAxios.delete<ErrorBackend>(
      "/usuario/delete",
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
      msg: error?.response?.data?.msg || "Hubo un error al eliminar la usuario",
    };
  }
};
