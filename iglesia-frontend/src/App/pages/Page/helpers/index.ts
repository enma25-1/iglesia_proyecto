import { Column } from "../../../../interfaces/global";
import { PageItem } from "../interfaces";
import { formatUsuarioForeign } from "../../../../helpers";
import * as Iconos from "@mui/icons-material";

export const IconosFiltered = Object.keys(Iconos).filter((nombreIcono) =>
  nombreIcono.endsWith("Rounded")
);
export enum SocketOnPage {
  agregar = "cliente:page-agregar",
  editar = "cliente:page-editar",
}

export enum SocketEmitPage {
  agregar = "server:page-agregar",
  editar = "server:page-editar",
}
export const columns: Column[] = [
  { label: "", minWidth: 50, align: "center", sortable: false },
  { label: "Nombre", minWidth: 40, sortable: false },
  { label: "Icono", minWidth: 40, sortable: false },
  { label: "Eliminar", minWidth: 80, sortable: false },
  { label: "Agregar", minWidth: 80, sortable: false },
  { label: "Actualizar", minWidth: 80, sortable: false }, 
  { label: "Ver", minWidth: 80, sortable: false },
];

export const sortDefault = { asc: false, campo: "name" };

export const itemDefault: PageItem = {
  // _id: "",
  nombre: "",
  icono: "",
  padre: "",
  tipo: "SECCION",
  delete: [],
  update: [],
  insert: [],
 
  ver: [],
  createdAt: "",
  updatedAt: "",
  orden: 0,
  componente: "Seccion",
  rUsuario: formatUsuarioForeign(),
  eUsuario: formatUsuarioForeign(),
};

export const columnsStocks: Column[] = [
  { label: "Sucursal", minWidth: 50 },
  { label: "Cantidad", minWidth: 200 },
];

export const removeDuplicates = (array: PageItem[]) => {
  let ids = array.map((obj) => obj._id); // Obtén los ids de todos los objetos
  return array.filter((obj, index) => {
    return ids.indexOf(obj._id) === index; // Retorna solo el primer objeto de cada id
  });
};

export const getParents = (
  children: PageItem[],
  allData: PageItem[],
  allParents: PageItem[] = []
): PageItem[] => {
  // Encuentra los padres actuales
  const currentParents = allData.filter((padre) =>
    children.some((child) => child.padre === padre._id)
  );

  // Si no hay padres actuales, retorna todos los padres encontrados
  if (currentParents.length === 0) {
    return allParents;
  }

  // Si hay padres actuales, añádelos a todos los padres
  allParents.push(...currentParents);

  // Llama a getParents de nuevo con los padres actuales
  return getParents(currentParents, allData, allParents);
};
