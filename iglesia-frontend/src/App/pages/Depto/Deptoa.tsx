import { Action, Sort } from "../../../interfaces/global";
import { AddCircle, Cancel, Refresh } from "@mui/icons-material";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { DeptoItem, setDataProps, useSocketEvents } from ".";
import {
  paginationDefault,
  rowsPerPageOptions,
  validateFunction,
} from "../../../helpers";
import { PaperContainerPage } from "../../components/style";
import { columns, getDeptos, itemDefault, sortDefault } from "./helpers";
import { TableHeader } from "../../components/Tabla/TableHeader";
import { useNavigate } from "react-router-dom";
import { useCommonStates } from "../../hooks";
import queryString from "query-string";

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
} from "../../components"; // Importaciones de hooks de menú y notificaciones.
import { usePageStore } from "../Page";
import { toast } from "react-toastify"; // Definición de las columnas de la tabla.
import { RowDepto } from "./components/RowDepto";
import { EditableDepto } from "./components/EditableDepto";
import { TableNoData } from "../../components/Tabla/TableNoData";

export const Depto = ({
  dontChangePath = false,
}: {
  dontChangePath?: boolean;
}) => {
  // Hooks de navegación y rutas.
  const navigate = useNavigate();

  // Hooks personalizados para permisos.
  const { noTienePermiso, getPathPage, data: dataMenu } = usePageStore();

  const { path } = useMemo(() => getPathPage("Depto", false), [dataMenu]);
  // Estados locales para el manejo de la UI y datos.
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
  } = useCommonStates(sortDefault);
  const [deptosData, setDeptosData] = useState<DeptoItem[]>([]);
  const [pagination, setPagination] = useState(paginationDefault);

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
    setData({ pagination: paginationDefault, sort, busqueda: value });
  };

  // Función asíncrona para obtener y establecer datos.
  const setData = async ({ pagination, sort, busqueda }: setDataProps) => {
    setCargando(true);
    const { error, result } = await getDeptos({ pagination, sort, busqueda });

    if (error.error) {
      toast.error(error.msg);
      return;
    }
    const { docs, ...rest } = result;
    setPagination(rest);
    setDeptosData(docs);
    setSort(sort);
    setBusqueda(busqueda);
    setCargando(false);
  };

  // Efectos secundarios para la sincronización con la URL y sockets.
  const {
    q = "",
    buscando: buscandoQuery,
    pagination: paginationQuery,
    sort: sortQuery,
  } = queryString.parse(location.search) as {
    q: string;
    buscando: string;
    pagination: string;
    sort: string;
  };

  useEffect(() => {
    if (!dontChangePath) {
      let params = new URLSearchParams(window.location.search);
      params.set("q", busqueda);
      params.set("buscando", buscando ? "true" : "false");
      params.set("sort", JSON.stringify(sort));
      params.set("pagination", JSON.stringify(pagination));
      navigate(`?${params.toString()}`, { replace: true });
    }
  }, [busqueda, buscando, sort, pagination]);

  useEffect(() => {
    if (dontChangePath) {
      const estaBuscando = Boolean(buscandoQuery === "true");
      setBuscando(estaBuscando);
      setData({
        pagination,
        sort,
        busqueda,
      });
    } else {
      const estaBuscando = Boolean(buscandoQuery === "true");
      setBuscando(estaBuscando);
      setData({
        pagination: paginationQuery
          ? JSON.parse(paginationQuery)
          : paginationDefault,
        sort: sortQuery ? JSON.parse(sortQuery) : sort,
        busqueda: estaBuscando ? q : "",
      });
    }
  }, []);

  useSocketEvents({ setDeptosData, setPagination });
  // Acciones disponibles en la UI.
  const actions: Action[] = [
    {
      color: "primary",
      Icon: Refresh,
      name: "Actualizar",
      onClick: () => setData({ pagination, sort, busqueda }),
      tipo: "icono",
    },
    {
      color: agregando ? "error" : "success",
      Icon: agregando ? Cancel : AddCircle,
      name: "Agregar Departamento",
      onClick: () => {
        if (noTienePermiso("Depto", "insert")) return;
        setAgregando(!agregando);
      },
      tipo: "icono",
    },
  ];

  return (
    <PaperContainerPage
      tabIndex={-1}
      onKeyDown={(e) => {
        if (validateFunction(e)) return;

        actions[Number(e.key) - 1].onClick(null);
      }}
    >
      <Buscador
        buscando={buscando}
        cargando={cargando}
        onSearch={(value) => searchFunction(true, value)}
        onSearchCancel={() => searchFunction(false, "")}
      />
      <>
        <TableTitle texto={path} />
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Acciones actions={actions} />
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
        <TablaLayout>
          <TableHeader
            columns={columns}
            sort={sort}
            sortFunction={sortFunction}
          />

          {cargando ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <Cargando titulo="Cargando Deptos..." />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {agregando && (
                <EditableDepto
                  esNuevo
                  setEditando={() => {}}
                  depto={{ ...itemDefault, crud: { nuevo: true } }}
                  setAgregando={setAgregando}
                />
              )}
              {deptosData.length === 0 ? (
                <TableNoData
                  length={columns.length}
                  title="No hay departamentos"
                />
              ) : (
                deptosData.map((depto) => {
                  return (
                    <RowDepto
                      key={depto._id}
                      depto={depto}
                      busqueda={busqueda}
                    />
                  );
                })
              )}
            </TableBody>
          )}
        </TablaLayout>
      </>
    </PaperContainerPage>
  );
};

export default Depto;
