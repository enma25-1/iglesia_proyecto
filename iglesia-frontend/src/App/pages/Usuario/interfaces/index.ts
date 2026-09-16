import {
  Crud,
  ErrorBackend,
  Pagination,
  Sort,
} from "../../../../interfaces/global";
import { Roles } from "../../../../store/interfaces";
export interface UsuarioForeign {
  _id: string;
  name: string;
  lastname: string;
  tel: string;
}
export interface UsuarioItem {
  _id?: string | undefined;
  crud?: Crud | undefined;
  username: string;
  estado: boolean;
  lastname: string;
  name: string;
  online: boolean;
  photo: string;
  rol: Roles;
  tel: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsuarioState {
  data: UsuarioItem[];
  pagination: Pagination;
  openModal: boolean;
  itemActive: UsuarioItem;
  itemDefault: UsuarioItem;
}

export interface setDataProps {
  busqueda: string;
  pagination: Pagination;
  sort: Sort;
  rol: Roles;
  estado: boolean;
}
export interface setDataPropsNoRequired {
  busqueda?: string;
  pagination?: Pagination;
  sort?: Sort;
  rol?: Roles;
  estado?: boolean;
}

export type GetDataUsuario = (params: setDataProps) => Promise<{
  paginationResult: Pagination;
  error: ErrorBackend;
}>;

export interface UsuarioActions {
  onEliminarUsuario: (_id: string) => Promise<ErrorBackend>;
}
