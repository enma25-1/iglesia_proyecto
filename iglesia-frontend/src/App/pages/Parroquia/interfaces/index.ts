import {
  Crud,
  ErrorBackend,
  Pagination,
  Sort,
} from "../../../../interfaces/global";
import { DeptoForeign } from "../../Depto";
import { MunicipioForeign } from "../../Depto/components/Municipio/interfaces";
import { DistritoForeign } from "../../Depto/components/Distrito/interfaces";

export interface ParroquiaForeign {
  direccion: string;
  name: string;
  _id?: string;
}
export interface ParroquiaItem {
  direccion: string;
  estado: boolean;
  municipio: MunicipioForeign;
  distrito: DistritoForeign;
  depto: DeptoForeign;
  name: string;
  _id?: string;
  crud?: Crud;
}

export interface ParroquiaState {
  data: ParroquiaItem[];
  pagination: Pagination;
}
export interface setDataProps {
  busqueda: string;
  pagination: Pagination;
  sort: Sort;
}
export type GetDataParroquia = ({
  pagination,
  sort,
  busqueda,
}: {
  pagination: Pagination;
  sort: Sort;
  busqueda: string;
}) => Promise<{
  paginationResult: Pagination;
  error: ErrorBackend;
}>;
export interface ParroquiaActions {
  onAgregarParroquia: (item: ParroquiaItem) => Promise<ErrorBackend>;
  onEditParroquia: (item: ParroquiaItem) => Promise<ErrorBackend>;
  onEliminarParroquia: (_id: string) => Promise<ErrorBackend>;
}
