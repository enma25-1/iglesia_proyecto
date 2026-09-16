import { AddCircle, Cancel, Refresh } from "@mui/icons-material";
import { ChangeEvent, useEffect, useState } from "react";
import { getDistritos, columns, itemDefault } from "./helpers";
import { DistritoItem, setDataProps } from "./interfaces";
import { paginationDefault, rowsPerPageOptions } from "../../../../../helpers";
import { RowDistrito } from "./components/RowDistrito";
import { Sort } from "../../../../../interfaces/global";
import { TableHeader } from "../../../../components/Tabla/TableHeader";
import { toast } from "react-toastify";
import { usePageStore } from "../../../Page";
import { useDistritoSocketEvents } from "./hooks/useSocketEvents";
import {
  Box,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
} from "@mui/material";
import {
  Acciones,
  Buscador,
  Cargando,
  TablaLayout,
  TableTitle,
} from "../../../../components";
import { useCommonStates } from "../../../../hooks";
import { EditableDistrito } from "./components/EditableDistrito";
import { TableNoData } from "../../../../components/Tabla/TableNoData";

export const TablaDistrito = ({ depto, municipio }: { depto: string; municipio?: string }) => {
  const { noTienePermiso } = usePageStore();
  const {
    agregando,
    buscando,
    busqueda,
    cargando,
    setAgregando,
    setBuscando,
    setBusqueda,
    setCargando,
    setSort,
    sort,
  } = useCommonStates({ asc: true, campo: "name" });

  const [distritosData, setDistritosData] = useState<DistritoItem[]>([]);
  const [pagination, setPagination] = useState(paginationDefault);

  const handleChangePage = (_: unknown, newPage: number) => {
    setData({
      pagination: { ...pagination, page: newPage + 1 },
      sort,
      busqueda: "",
    });
  };
  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setData({
      pagination: { ...pagination, page: 1, limit: +event.target.value },
      sort,
      busqueda: "",
    });
  };
  const sortFunction = (newSort: Sort) => {
    setData({
      pagination,
      sort: newSort,
      busqueda: "",
    });
  };

  const setData = async ({
    pagination,
    sort,
    busqueda,
  }: Omit<setDataProps, "depto" | "municipio">) => {
    setCargando(true);
    const { error, result } = await getDistritos({
      pagination,
      sort,
      depto,
      municipio,
      busqueda,
    });
    if (error.error) {
      return toast.error(error.msg);
    }
    const { docs, ...rest } = result;
    setPagination(rest);
    setDistritosData(docs);
    setSort(sort);
    setBusqueda(busqueda);
    setCargando(false);
  };

  useEffect(() => {
    setData({ pagination, sort, busqueda });
  }, []);

  useDistritoSocketEvents({
    depto,
    setPagination,
    setDistritosData,
  });

  return (
    <>
      <Buscador
        cargando={cargando}
        buscando={buscando}
        onSearch={(value) => {
          setBuscando(true);
          setData({ pagination: paginationDefault, sort, busqueda: value });
        }}
        onSearchCancel={() => {
          setBuscando(false);
          setData({ pagination: paginationDefault, sort, busqueda: "" });
        }}
      />
      <TableTitle texto={"Distritos"} align="left" />
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Acciones
          actions={[
            {
              color: "primary",
              Icon: Refresh,
              name: "Actualizar",
              onClick() {
                setData({ pagination, sort, busqueda });
              },
              tipo: "icono",
            },
            {
              color: agregando ? "error" : "success",
              Icon: agregando ? Cancel : AddCircle,
              name: "Agregar",
              onClick() {
                if (noTienePermiso("Depto", "insert")) return;
                setAgregando(!agregando);
              },
              tipo: "icono",
            },
          ]}
        />
        <TablePagination
          className="tablePagination"
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={pagination.totalDocs}
          rowsPerPage={pagination.limit}
          page={pagination.page - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
      <TablaLayout maxHeight="30vh">
        <TableHeader
          columns={columns}
          sort={sort}
          sortFunction={sortFunction}
        />
        {cargando ? (
          <TableBody>
            <TableRow>
              <TableCell colSpan={columns.length + 1}>
                <Cargando titulo="Cargando Distritos..." />
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>
            {agregando && (
              <EditableDistrito
                setEditando={() => {}}
                distrito={{ ...itemDefault, crud: { nuevo: true } }}
                depto={depto}
                municipio={municipio}
                setAgregando={setAgregando}
              />
            )}
            {distritosData.length === 0 ? (
              <TableNoData length={columns.length} title="No hay distritos" />
            ) : (
              distritosData.map((distrito) => {
                return (
                  <RowDistrito
                    busqueda={busqueda}
                    depto={depto}
                    distrito={distrito}
                    key={distrito._id}
                  />
                );
              })
            )}
          </TableBody>
        )}
      </TablaLayout>
    </>
  );
};
