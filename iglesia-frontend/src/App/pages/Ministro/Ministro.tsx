import { Action, FromAnotherComponent } from "../../../interfaces/global";
import { AddCircle, Cancel, Refresh } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { useMinistroStore } from ".";
import {
  paginationDefault,
  rowsPerPageOptions,
  validateFunction,
} from "../../../helpers";
import { PaperContainerPage } from "../../components/style";
import { columns, itemDefault, sortDefault } from "./helpers";
import { TableHeader } from "../../components/Tabla/TableHeader";
import { useNavigate } from "react-router-dom";
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
import { EditableMinistro } from "./components/EditableMinistro";
import { RowMinistro } from "./components/RowMinistro";
import { useSetDataFunctions } from "./hooks/useSetDataFunctions";
export const Ministro = ({ dontChangePath }: FromAnotherComponent) => {
  // Hooks de navegación y rutas.
  const navigate = useNavigate();

  const { noTienePermiso, data: dataMenu, getPathPage } = usePageStore();
  const { path } = useMemo(() => getPathPage("Ministro", false), [dataMenu]);

  const {
    data,
    pagination,
    getDataMinistro,
    onAgregarMinistro,
    onEditMinistro,
    onEliminarMinistro,
    onClearStateMinistro,
  } = useMinistroStore();
  // Estados locales para el manejo de la UI y datos.
  const [agregando, setAgregando] = useState(false);

  const {
    buscando,
    busqueda,
    cargando,
    handleChangePage,
    handleChangeRowsPerPage,
    searchFunction,
    setBuscando,
    setData,
    sort,
    sortFunction,
  } = useSetDataFunctions({
    getDataMinistro,
    pagination,
    sortDefault,
  });

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

  // ...dentro del componente Ministro...
  // useMinistroSocketListeners({
  //   socket,
  //   onAgregarMinistro,
  //   onEditMinistro,
  //   onEliminarMinistro,
  // });
  useEffect(() => {
    return () => {
      onClearStateMinistro();
    };
  }, []);

  // Acciones disponibles en la UI.
  const actions: Action[] = [
    {
      color: "primary",
      Icon: Refresh,
      name: "Actualizar",
      onClick: () => setData({ pagination, sort, busqueda: q }),
      tipo: "icono",
    },
    {
      color: agregando ? "error" : "success",
      Icon: agregando ? Cancel : AddCircle,
      name: "Agregar Departamento",
      onClick: () => {
        if (noTienePermiso("Ministro", "insert")) return;
        setAgregando(!agregando);
      },
      tipo: "icono",
    },
  ];

  return (
    <PaperContainerPage
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          return setData({ pagination, sort, busqueda: "" });
        }

        if (validateFunction(e)) return;

        actions[Number(e.key) - 1].onClick(null);
      }}
    >
      <Buscador
        label="Buscar"
        buscando={buscando}
        cargando={cargando}
        onSearch={(value) => searchFunction(true, value)}
        onSearchCancel={() => searchFunction(false, "")}
      />

      <TableTitle texto={path} Tabs={[]} />
      <>
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
                <TableCell colSpan={columns.length + 1}>
                  <Cargando titulo="Cargando Ministros..." />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {agregando && (
                <EditableMinistro
                  esNuevo
                  setEditando={() => {}}
                  ministro={{ ...itemDefault, crud: { nuevo: true } }}
                  setAgregando={setAgregando}
                  onAgregarMinistro={onAgregarMinistro}
                  onEditMinistro={onEditMinistro}
                  onEliminarMinistro={onEliminarMinistro}
                />
              )}
              {data.map((ministro) => {
                return (
                  <RowMinistro
                    key={ministro._id}
                    ministro={ministro}
                    busqueda={busqueda}
                    onAgregarMinistro={onAgregarMinistro}
                    onEditMinistro={onEditMinistro}
                    onEliminarMinistro={onEliminarMinistro}
                  />
                );
              })}
            </TableBody>
          )}
        </TablaLayout>
      </>
    </PaperContainerPage>
  );
};

export default Ministro;
