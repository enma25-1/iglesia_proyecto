import {
  GetDataUsuario, 
  setDataPropsNoRequired,
} from "../interfaces";
import { Pagination, Sort } from "../../../../interfaces/global";
import { useCommonStates } from "../../../hooks";
import { ChangeEvent, useState } from "react";
import { paginationDefault } from "../../../../helpers";
import { toast } from "react-toastify";
import { Roles } from "../../../../store/interfaces";

export const useSetDataFunctions = ({
  pagination,
  sortDefault,
  getDataUsuario,
}: {
  sortDefault: Sort;
  pagination: Pagination;
  getDataUsuario: GetDataUsuario;
}) => {
  const {
    buscando,
    busqueda,
    cargando,
    setBuscando,
    setBusqueda,
    setCargando,
    setSort,
    sort,
  } = useCommonStates(sortDefault);
  const [rol, setRol] = useState<Roles>("ADMINISTRADOR");
  const [estado, setEstado] = useState(true);
  // Función de alto nivel para manejar
  const handleChangePage = (_: unknown, newPage: number) => {
    setData({
      pagination: { ...pagination, page: newPage + 1 },
    });
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setData({
      pagination: { ...pagination, page: 1, limit: +event.target.value },
    });
  };

  const sortFunction = (newSort: Sort) => {
    setData({ sort: newSort });
  };
  const searchFunction = (newBuscando: boolean, value: string) => {
    setBuscando(newBuscando);
    setData({
      pagination: paginationDefault,
      sort,
      busqueda: value,
    });
  };

  // Función asíncrona para obtener y establecer datos.
  const setData = async ({
    pagination: paginationParam = pagination,
    sort: sortParam = sort,
    busqueda: busquedaParam = busqueda,
    estado: estadoP = estado,
    rol: rolP = rol,
  }: setDataPropsNoRequired) => {
    setCargando(true);
    const { error } = await getDataUsuario({
      pagination: paginationParam,
      sort: sortParam,
      busqueda: busquedaParam,
      estado: estadoP,
      rol: rolP,
    });

    if (error.error) {
      toast.error(error.msg);
      return;
    }
    // setProductosData(docs);
    setSort(sortParam);
    setBusqueda(busquedaParam);
    setEstado(estadoP);
    setRol(rolP);
    setCargando(false);
    if (
      busquedaParam
      // Object.values(busquedaAvanzadaParam).some((valor) => valor)
    ) {
      setBuscando(true);
    }
  };

  return {
    setData,
    handleChangePage,
    handleChangeRowsPerPage,
    sortFunction,
    searchFunction,
    buscando,
    busqueda,
    cargando,
    setBuscando,
    setBusqueda,
    setCargando,
    setSort,
    sort,
    estado,
    rol,
  };
};
