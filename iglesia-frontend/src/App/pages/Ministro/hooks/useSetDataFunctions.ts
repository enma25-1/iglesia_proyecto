import { GetDataMinistro, setDataProps } from "../interfaces";
import { Pagination, Sort } from "../../../../interfaces/global";
import { useCommonStates } from "../../../hooks";
import { ChangeEvent } from "react";
import { paginationDefault } from "../../../../helpers";
import { toast } from "react-toastify";

export const useSetDataFunctions = ({
  pagination,
  sortDefault,
  getDataMinistro,
}: {
  sortDefault: Sort;
  pagination: Pagination;
  getDataMinistro: GetDataMinistro;
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
  // Función de alto nivel para manejar
  const handleChangePage = (_: unknown, newPage: number) => {
    setData({
      pagination: { ...pagination, page: newPage + 1 },
      busqueda,
      sort,
    });
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setData({
      pagination: { ...pagination, page: 1, limit: +event.target.value },
      busqueda,
      sort,
    });
  };

  const sortFunction = (newSort: Sort) => {
    setData({ pagination, busqueda, sort: newSort });
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
  const setData = async ({ pagination, sort, busqueda }: setDataProps) => {
    setCargando(true);
    const { error } = await getDataMinistro({
      pagination,
      sort,
      busqueda,
    });

    if (error.error) {
      toast.error(error.msg);
      setCargando(false);
      return;
    }
    // setProductosData(docs);
    setSort(sort);
    setBusqueda(busqueda);
    setCargando(false);
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
  };
};
