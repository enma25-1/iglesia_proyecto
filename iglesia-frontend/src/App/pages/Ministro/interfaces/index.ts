import {
  Crud,
  ErrorBackend,
  Pagination,
  Sort,
} from "../../../../interfaces/global";
import { DeptoForeign } from "../../Depto";
import { MunicipioForeign } from "../../Depto/components/Municipio/interfaces";
import { DistritoForeign } from "../../Depto/components/Distrito/interfaces";

export interface OrdenMinisterial {
  name: string;
  abreviatura: string;
}

export const ORDENES_MINISTERIALES: OrdenMinisterial[] = [
  { name: "Monseñor", abreviatura: "Mons." },
  { name: "Presbítero", abreviatura: "Pbro." },
  { name: "Arzobispo", abreviatura: "Arzob." },
  { name: "Cardenal", abreviatura: "Card." },
  { name: "Diácono", abreviatura: "Diác." },
];

export interface MinistroForeign {
  estado: boolean;
  name: string;
  _id?: string;
  orden?: OrdenMinisterial;
}
export interface MinistroItem {
  estado: boolean;
  name: string;
  orden: OrdenMinisterial;
  municipio: MunicipioForeign;
  distrito: DistritoForeign;
  depto: DeptoForeign;
  _id?: string;
  crud?: Crud;
}

export interface MinistroState {
  data: MinistroItem[];
  pagination: Pagination;
}
export interface setDataProps {
  busqueda: string;
  pagination: Pagination;
  sort: Sort;
}
export type GetDataMinistro = ({
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

export interface MinistroActions {
  onAgregarMinistro: (item: MinistroItem) => Promise<ErrorBackend>;
  onEditMinistro: (item: MinistroItem) => Promise<ErrorBackend>;
  onEliminarMinistro: (_id: string) => Promise<ErrorBackend>;
}
