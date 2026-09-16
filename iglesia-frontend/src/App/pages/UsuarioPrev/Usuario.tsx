import { Action, FromAnotherComponent, Sort } from "../../../interfaces/global";
import { AddCircle, Cancel, Create, Refresh } from "@mui/icons-material";
import { Box, TableBody, TablePagination } from "@mui/material";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { columns, getUsuarios, sortDefault } from "./helpers";
import { ModalRoute } from "./components/ModalRoute";
import { PaperContainerPage } from "../../components/style";
import { Roles } from "../../../store/interfaces";
import { Route, Routes, useNavigate } from "react-router-dom";
import { StaticUsuario, UsuarioItem, setDataProps, useSocketEvents } from ".";
import { TableCargando } from "../../components/Tabla/TableCargando";
import { TableHeader } from "../../components/Tabla/TableHeader";
import { TableNoData } from "../../components/Tabla/TableNoData";
import { toast } from "react-toastify";
import { useCommonStates } from "../../hooks";
import { usePageStore } from "../Page";
import { useUsuarioStore } from "./hooks/useUsuarioStore";
import queryString from "query-string";
import {
  getSubPath,
  paginationDefault,
  roles,
  rowsPerPageOptions,
  validateFunction,
} from "../../../helpers";
import { Acciones, Buscador, TablaLayout, TableTitle } from "../../components";
export const Usuario = ({ dontChangePath }: FromAnotherComponent) => {
  // Hooks de navegación y rutas.
  // Importaciones y definiciones de estado
  const navigate = useNavigate();
  const { noTienePermiso, data: dataMenu, getPathPage } = usePageStore();
  const { path } = useMemo(() => getPathPage("Usuario", false), [dataMenu]);
  const { setItemActive, setOpenModal, itemActive, openModal, itemDefault } =
    useUsuarioStore();
  const [rol, setRol] = useState<Roles>("ADMINISTRADOR");
  const [estado, setEstado] = useState(true);

  const {
    buscando,
    busqueda,
    cargando,
    setCargando,
    setBuscando,
    setBusqueda,
    setSort,
    sort,
  } = useCommonStates(sortDefault);
  const [usuariosData, setUsuariosData] = useState<UsuarioItem[]>([]);
  const [pagination, setPagination] = useState(paginationDefault);

  // Función de alto nivel para manejar
  const handleChangePage = (_: unknown, newPage: number) => {
    setData({
      pagination: { ...pagination, page: newPage + 1 },
      busqueda,
      sort,
      estado,
      rol,
    });
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setData({
      pagination: { ...pagination, page: 1, limit: +event.target.value },
      busqueda,
      sort,
      estado,
      rol,
    });
  };

  const sortFunction = (newSort: Sort) => {
    setData({ pagination, busqueda, sort: newSort, estado, rol });
  };
  const searchFunction = (newBuscando: boolean, value: string) => {
    setBuscando(newBuscando);
    setData({
      pagination: paginationDefault,
      sort,
      busqueda: value,
      estado,
      rol,
    });
  };
  const handleChangeEstado = (newEstado: boolean) => {
    setData({ pagination, sort, busqueda, estado: newEstado, rol });
  };
  const handleChangeTab = (newRol: Roles) => {
    setData({
      pagination,
      sort,
      busqueda,
      estado,
      rol: newRol,
    });
  };

  // Función asíncrona para obtener y establecer datos.
  const setData = async ({
    pagination,
    sort,
    busqueda,
    estado,
    rol,
  }: setDataProps) => {
    setCargando(true);
    const { error, result } = await getUsuarios({
      pagination,
      sort,
      busqueda,
      estado,
      rol,
    });

    if (error.error) {
      toast.error(error.msg);
      return;
    }
    const { docs, ...rest } = result;
    setPagination(rest);
    setUsuariosData(docs);
    setSort(sort);
    setBusqueda(busqueda);
    setCargando(false);
    setEstado(estado);
    setRol(rol);
  };

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
    rol: Roles | undefined;
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
      setData({
        pagination,
        sort,
        busqueda,
        estado,
        rol,
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
        estado: estadoQuery ? estadoQuery === "true" : estado,
        rol: rolQuery || rol,
      });
    }
  }, []);

  useSocketEvents({ setUsuariosData, setPagination });
  const nuevoActive = useMemo(() => itemActive.crud?.agregando, [itemActive]);

  const tabsRoles: Action[] = roles.map((rolMap) => ({
    color: "primary",
    Icon: Refresh,
    name: rolMap,
    onClick: () => {
      handleChangeTab(rolMap);
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
      handleChangeEstado(!estado);
    },
    size: "small",
    tipo: "tab",
    active: !estado,
  };

  const actions: Action[] = [
    {
      color: "primary",
      Icon: Refresh,
      name: "Actualizar",
      onClick: () => setData({ pagination, sort, busqueda: q, rol, estado }),
      tipo: "icono",
    },
    {
      color: "success",
      Icon: AddCircle,
      name: "Nuevo",
      tipo: "icono",
      disabled: nuevoActive,
      onClick: async () => {
        const canActive = await setItemActive({
          ...itemDefault,
          crud: { agregando: true },
        });
        if (canActive) {
          let params = new URLSearchParams(window.location.search);

          navigate(`nuevo?${params.toString()}`);
          setOpenModal(true);
        }
      },
    },
    {
      color: nuevoActive ? "success" : "secondary",
      tipo: "icono",
      badge: "index",
      disabled: false,
      Icon: Create,
      name: `Continuar ${nuevoActive ? "Creando" : "Editando"}`,
      ocultar: !Boolean(itemActive._id) && !nuevoActive,
      onClick: () => {
        if (!Boolean(itemActive._id) && !nuevoActive) return;
        setOpenModal(!openModal);
      },
    },
    {
      color: "error",
      tipo: "icono",
      badge: "index",
      disabled: false,
      Icon: Cancel,
      name: `Cancelar ${nuevoActive ? "Creando" : "Edición"}`,
      ocultar: !Boolean(itemActive._id) && !nuevoActive,
      onClick: async () => {
        navigate(getSubPath());
        setItemActive(itemDefault, true);
      },
    },
  ];

  const handleEditar = useCallback(
    async (itemEditing: UsuarioItem) => {
      if (noTienePermiso("Page", "update")) {
        return;
      }

      const canActive = await setItemActive(itemEditing);
      if (canActive) {
        let params = new URLSearchParams(window.location.search);
        navigate(`${itemEditing._id || ""}?${params.toString()}`);
        setOpenModal(!openModal);
      }
    },
    [dataMenu, itemActive],
  );

  return (
    <>
      <PaperContainerPage
        tabIndex={-1}
        onKeyDown={(e) => {
          if (validateFunction(e)) return;

          actions[Number(e.key) - 1].onClick(null);
        }}
      >
        <Routes>
          <Route
            path="/:_id"
            element={
              <ModalRoute usuariosData={usuariosData} cargando={cargando} />
            }
          />
        </Routes>
        <Buscador
          buscando={buscando}
          cargando={cargando}
          onSearch={(value) => searchFunction(true, value)}
          onSearchCancel={() => searchFunction(false, "")}
        />
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
              {usuariosData.length === 0 ? (
                <TableNoData length={columns.length} title="No hay Usuarios" />
              ) : (
                usuariosData.map((usuario) => {
                  return (
                    <StaticUsuario
                      key={usuario._id}
                      usuario={usuario}
                      busqueda={busqueda}
                      handleEditar={handleEditar}
                      itemActive={itemActive}
                    />
                  );
                })
              )}
            </TableBody>
          )}
        </TablaLayout>
      </PaperContainerPage>
    </>
  );
};

export default Usuario;
