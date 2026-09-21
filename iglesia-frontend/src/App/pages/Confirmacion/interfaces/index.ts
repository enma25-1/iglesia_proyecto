import {
  Crud,
  ErrorBackend,
  Pagination,
  Sort,
} from "../../../../interfaces/global";
import { MinistroForeign } from "../../Ministro";
import { ParroquiaForeign } from "../../Parroquia";

export interface ConfirmacionForeign {
  direccion: string;
  name: string;
  _id: string;
}

export type TipoConfirmacion = "normal" | "supletoria";

export interface ConfirmacionItem {
  apellidos: string;
  nombres: string;
  edad: string;
  parroquiaBustismo: ParroquiaForeign;
  parroquiaConfirmacion: ParroquiaForeign;
  ministro: MinistroForeign;
  ministroConfirma: MinistroForeign;
  padre: string;
  madre: string;
  padrino: string;
  madrina: string;
  fecha: string;
  createdAt: string;
  updatedAt: string;
  libro: number;
  folio: number;
  observacion: string;
  tipo: TipoConfirmacion;
  _id?: string;
  crud?: Crud;
}

export interface ConfirmacionState {
  data: ConfirmacionItem[];
  pagination: Pagination;
  openModal: boolean;
  itemActive: ConfirmacionItem;
  itemDefault: ConfirmacionItem;
}
export interface BusquedaAvanzadaConfirmacion {
  fecha1: string;
  fecha2: string;
  parroquiaBautismo: string;
  parroquiaConfirmacion: string;
  // Se agrega desde el componente (no es un filtro editable en el formulario)
  // para restringir la lista/creación a un tipo de confirma en particular:
  // "normal" (apartado Confirmaciones) o "supletoria" (apartado Supletorias).
  tipo?: TipoConfirmacion;
}

export interface setDataProps {
  busqueda: string;
  pagination: Pagination;
  sort: Sort;
  busquedaAvanzada: BusquedaAvanzadaConfirmacion;
}

export type GetDataConfirmacion = (params: {
  pagination: Pagination;
  sort: Sort;
  busqueda: string;
  busquedaAvanzada: BusquedaAvanzadaConfirmacion;
}) => Promise<{
  paginationResult: Pagination;
  error: ErrorBackend;
}>;

export interface ConfirmacionActions {
  onEliminarConfirmacion: (_id: string) => Promise<ErrorBackend>;
}
