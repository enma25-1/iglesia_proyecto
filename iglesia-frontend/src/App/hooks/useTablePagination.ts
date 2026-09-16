import { ChangeEvent, useState } from "react";

export const useTablePagination = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return {
    handleChangePage,
    handleChangeRowsPerPage,
    page,
    rowsPerPage,
    setPage,
    setRowsPerPage,
  };
};
