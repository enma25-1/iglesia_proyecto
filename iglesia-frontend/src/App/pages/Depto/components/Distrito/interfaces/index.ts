import { Crud, Pagination, Sort } from "../../../../../../interfaces/global";

export interface DistritoForeign {
  name: string;
  _id?: string;
}
export interface DistritoItem {
  depto: string;
  name: string;
  municipio?: string;
  municipioNombre?: string;
  _id?: string;
  crud?: Crud;
}
export interface setDataProps {
  busqueda: string;
  depto: string;
  municipio?: string;
  pagination: Pagination;
  sort: Sort;
}
