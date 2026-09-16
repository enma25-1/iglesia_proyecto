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

export const sortDefault = { asc: false, campo: "online" };

export const itemDefault: UsuarioItem = {
  username: "",
  lastname: "",
  name: "",
  online: false,
  photo: "", 
  tel: "",
  rol: "ADMINISTRATIVO",
  estado: true,
  createdAt: new Date().toISOString(),
  updatedAt: "",
};

interface Result extends Pagination {
  docs: UsuarioItem[];
}

interface MyResponse {
  data: { result: Result };
}

type getUsuariosType = (params: setDataProps) => Promise<{
  error: ErrorBackend;
  result: Result;
}>;

export const getUsuarios: getUsuariosType = async ({
  busqueda,
  pagination,
  sort,
  rol,
  estado,
}) => {
  try {
    const {
      data: { result },
    }: MyResponse = await clienteAxios.post("/usuario", {
      pagination,
      sort,
      busqueda,
      rol,
      estado,
    });

    return {
      error: {
        error: false,
        msg: "",
      },
      result,
    };
  } catch (error: any) {
    return {
      error: {
        error: true,
        msg: error?.response?.data?.msg || "Error al consultar las usuarios",
      },
      result: { docs: [], ...paginationDefault },
    };
  }
};
