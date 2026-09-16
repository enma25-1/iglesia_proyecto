import { Action, FromAnotherComponent } from "../../../interfaces/global";
import { AddCircle, Cancel, Refresh } from "@mui/icons-material";
import { useCallback, useEffect, useMemo } from "react";
import { UsuarioItem, useUsuarioStore } from ".";
import {
  paginationDefault,
  roles,
  rowsPerPageOptions,
  validateFunction,
} from "../../../helpers";
import { PaperContainerPage } from "../../components/style";
import { columns, itemDefault, sortDefault } from "./helpers";
import { TableHeader } from "../../components/Tabla/TableHeader";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";

import { Box, TableBody, TablePagination } from "@mui/material";
import {
  Acciones,
  Buscador,
  TablaLayout,
  TableNoData,
  TableTitle,
} from "../../components"; // Importaciones de hooks de menú y notificaciones.
import { usePageStore } from "../Page";
import { StaticUsuario } from "./components/StaticUsario";
import {
  // busquedaAvanzadaD,
  useSetDataFunctions,
} from "./hooks/useSetDataFunctions";
import { TableCargando } from "../../components/Tabla/TableCargando";
import { ModalUsuario } from "./components/ModalUsuario";
import { Roles } from "../../../store/interfaces";

export const Usuario = ({ dontChangePath }: FromAnotherComponent) => {
  // Hooks de navegación y rutas.
  const navigate = useNavigate();

  const { noTienePermiso, data: dataMenu, getPathPage } = usePageStore();
  const { path } = useMemo(() => getPathPage("Usuario", false), [dataMenu]);
  const {
    data,
    pagination,
    openModal,
    getDataUsuario,
    // onAgregarUsuario,
    // onEditUsuario,
    itemActive,
    onClearStateUsuario,
    setOpenModal,
    setItemActive,
  } = useUsuarioStore();
  // Estados locales para el manejo de la UI y datos.

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
    estado,
    rol,
    // setbusquedaAvanzada,
  } = useSetDataFunctions({
    getDataUsuario,
    pagination,
    sortDefault,
  });

  // Efectos secundarios para la sincronización con la URL y sockets.
  const {
    q = "",
    buscando: buscandoQuery,
    pagination: paginationQuery,
    sort: sortQuery,
    estado: estadoQuery,
    rol: rolQuery,
  } = queryString.parse(location.search) as {
    q: string;
    buscando: string;
    pagination: string;
    sort: string;
    estado: string;
    rol: Roles;
  };

  useEffect(() => {
    if (!dontChangePath) {
      let params = new URLSearchParams(window.location.search);
      params.set("q", busqueda);
      params.set("buscando", buscando ? "true" : "false");
      params.set("sort", JSON.stringify(sort));
      params.set("pagination", JSON.stringify(pagination));
      params.set("estado", estado ? "true" : "false");
      params.set("rol", rol);
      navigate(`?${params.toString()}`, { replace: true });
    }
  }, [busqueda, buscando, sort, pagination, estado, rol]);

  useEffect(() => {
    console.log({ paginationQuery });

    if (dontChangePath) {
      const estaBuscando = Boolean(buscandoQuery === "true");
      setBuscando(estaBuscando);
      setData({});
    } else {
      const estaBuscando = Boolean(buscandoQuery === "true");
      setBuscando(estaBuscando);

      setData({
        pagination: paginationQuery
          ? JSON.parse(paginationQuery)
          : paginationDefault,
        sort: sortQuery ? JSON.parse(sortQuery) : sort,
        estado: estadoQuery ? JSON.parse(estadoQuery) : estado,
        rol: rolQuery ? rolQuery : rol,
        busqueda: estaBuscando ? q : "",
      });
    }
  }, []);

  // ...dentro del componente Usuario...
  // useUsuarioSocketListeners({
  //   socket,
  //   onAgregarUsuario,
  //   onEditUsuario,
  //   onEliminarUsuario,
  // });
  useEffect(() => {
    return () => {
      onClearStateUsuario();
    };
  }, []);
  const tabsRoles: Action[] = roles.map((rolMap) => ({
    color: "primary",
    Icon: Refresh,
    name: rolMap,
    onClick: () => {
      setData({
        rol: rolMap,
      });
    },
    size: "small",
    tipo: "tab",
    active: rolMap === rol,
  }));
  const tabEstado: Action = {
    color: "error",
    Icon: Refresh,
    name: "Inactivos",
    onClick: () => {
      setData({ estado: !estado });
    },
    size: "small",
    tipo: "tab",
    active: !estado,
  };
  // Acciones disponibles en la UI.
  const actions: Action[] = [
    {
      color: "primary",
      Icon: Refresh,
      name: "Actualizar",
      onClick: () => setData({ busqueda: q }),
      tipo: "icono",
    },
    {
      color: openModal ? "error" : "success",
      Icon: openModal ? Cancel : AddCircle,
      name: "Agregar Confirmación",
      onClick: () => {
        if (noTienePermiso("Usuario", "insert")) return;
        setItemActive(itemDefault);
        setOpenModal(true);
      },
      tipo: "icono",
    },
  ];
  const handleEditar = useCallback(
    async (itemEditing: UsuarioItem) => {
      if (noTienePermiso("Page", "update")) {
        return;
      }

      await setItemActive(itemEditing);

      setOpenModal(true);
    },
    [dataMenu],
  );

  return (
    <PaperContainerPage
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          return setData({ busqueda: "" });
        }

        if (validateFunction(e)) return;

        actions[Number(e.key) - 1].onClick(null);
      }}
    >
      <ModalUsuario />
      <Buscador
        label="Buscar"
        buscando={buscando}
        cargando={cargando}
        busqueda={busqueda}
        onSearch={(value) => searchFunction(true, value)}
        onSearchCancel={() => {
          searchFunction(false, "");
        }}
      />
      {/* <Box display={"flex"}>
        <TextField
          fullWidth
          type="date"
          label="Fecha Inicio"
          value={busquedaAvanzada.fecha1}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => {
            setData({
              pagination,
              sort,
              busqueda: q,
            });
          }}
        />
        <TextField
          fullWidth
          type="date"
          label="Fecha Fin"
          value={busquedaAvanzada.fecha2}
          InputLabelProps={{ shrink: true }}
          onChange={(e) => {
            setData({
              pagination,
              sort,
              busqueda: q,
            });
          }}
        />
      </Box> */}
      <>
        <TableTitle texto={path} Tabs={[...tabsRoles, tabEstado]} />
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
            <TableCargando columnsLength={columns.length} />
          ) : (
            <TableBody>
              {data.length === 0 ? (
                <TableNoData length={columns.length} title="No hay Usuarios" />
              ) : (
                data.map((usuario) => {
                  return (
                    <StaticUsuario
                      key={usuario._id}
                      usuario={usuario}
                      busqueda={busqueda}
                      itemActive={itemActive}
                      handleEditar={handleEditar}
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

export default Usuario;
