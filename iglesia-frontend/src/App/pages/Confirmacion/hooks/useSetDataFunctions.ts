import { GetDataConfirmacion, setDataProps } from "../interfaces";
import { Pagination, Sort } from "../../../../interfaces/global";
import { useCommonStates } from "../../../hooks";
import { ChangeEvent, useState } from "react";
import { paginationDefault } from "../../../../helpers";
import { toast } from "react-toastify";
import { BusquedaAvanzadaConfirmacion } from "../interfaces/index";
export const busquedaAvanzadaD = {
  fecha1: "",
  fecha2: "",
  parroquiaBautismo: "",
  parroquiaConfirmacion: "",
};
export const useSetDataFunctions = ({
  pagination,
  sortDefault,
  getDataConfirmacion,
}: {
  sortDefault: Sort;
  pagination: Pagination;
  getDataConfirmacion: GetDataConfirmacion;
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
  const [busquedaAvanzada, setbusquedaAvanzada] =
    useState<BusquedaAvanzadaConfirmacion>(busquedaAvanzadaD);
  // Función de alto nivel para manejar
  const handleChangePage = (_: unknown, newPage: number) => {
    setData({
      pagination: { ...pagination, page: newPage + 1 },
      busqueda,
      sort,
      busquedaAvanzada,
    });
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setData({
      pagination: { ...pagination, page: 1, limit: +event.target.value },
      busqueda,
      sort,
      busquedaAvanzada,
    });
  };

  const sortFunction = (newSort: Sort) => {
    setData({ pagination, busqueda, sort: newSort, busquedaAvanzada });
  };
  const searchFunction = (newBuscando: boolean, value: string) => {
    setBuscando(newBuscando);
    setData({
      pagination: paginationDefault,
      sort,
      busqueda: value,
      busquedaAvanzada: newBuscando ? busquedaAvanzada : busquedaAvanzadaD,
    });
  };

  // Función asíncrona para obtener y establecer datos.
  const setData = async ({
    pagination,
    sort,
    busqueda,
    busquedaAvanzada,
  }: setDataProps) => {
    console.log({ busquedaAvanzada });

    setCargando(true);
    const { error } = await getDataConfirmacion({
      pagination,
      sort,
      busqueda,
      busquedaAvanzada,
    });

    if (error.error) {
      toast.error(error.msg);
      setCargando(false);
      return;
    }
    // setProductosData(docs);
    setSort(sort);
    setCargando(false);
    setBusqueda(busqueda);
    setbusquedaAvanzada(busquedaAvanzada);
    if (busqueda || Object.values(busquedaAvanzada).some((valor) => valor)) {
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
    busquedaAvanzada,
    setbusquedaAvanzada,
  };
};
