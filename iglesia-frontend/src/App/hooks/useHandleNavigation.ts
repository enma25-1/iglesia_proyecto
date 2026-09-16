import { ChangeEvent } from "react";
import { Pagination, Sort } from "../../interfaces/global";
export const useHandleNavigation = <T = string, EstadoType = boolean>({
  handleEvent,
  pagination,
}: {
  handleEvent: ({
    newPagination,
    newSort,
    newTabValue,
  }: {
    newPagination?: Pagination;
    newSort?: Sort;
    newTabValue?: T;
    newEstadoValue?: EstadoType;
  }) => void;
  pagination: Pagination;
}) => {
  // Manejadores de eventos
  const handleChangePage = (_: unknown, newPage: number) => {
    handleEvent({ newPagination: { ...pagination, page: newPage + 1 } });
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    handleEvent({
      newPagination: { ...pagination, page: 1, limit: +event.target.value },
    });
  };

  const sortFunction = (newSort: Sort) => {
    handleEvent({ newSort: newSort });
  };

  const handleChangeTab = async (newValue: T) => {
    handleEvent({ newTabValue: newValue });
  };
  const handleChangeEstado = async (newValue: EstadoType) => {
    handleEvent({ newEstadoValue: newValue });
  };

  return {
    handleChangePage,
    handleChangeRowsPerPage,
    sortFunction,
    handleChangeTab,
    handleChangeEstado,
  };
};
