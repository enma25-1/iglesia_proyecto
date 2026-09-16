import { Action, FromAnotherComponent } from "../../../interfaces/global";
import {
  AddCircle,
  Cancel,
  Create,
  ExpandLess,
  ExpandMore,
  Refresh,
} from "@mui/icons-material";
import { Box, Collapse, TableBody, TableRow } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { columns, getParents, removeDuplicates } from "./helpers";
import { ModalRoute } from "./components/ModalRoute";
import {
  PaperContainerPage,
  StyledContainerSubTable,
  StyledTableCell,
} from "../../components/style";
import { Route, Routes, useNavigate } from "react-router-dom";
import { StaticPage, PageItem, setDataProps, useSocketEvents } from ".";
import { TableHeader } from "../../components/Tabla/TableHeader";
import { TableNoData } from "../../components/Tabla/TableNoData";

import { usePageStore } from "./hooks/usePageStore";
import queryString from "query-string";
import { getSubPath, normalize, validateFunction } from "../../../helpers";
import { Acciones, Buscador, TablaLayout, TableTitle } from "../../components";

const generarRows = (
  data: PageItem[],
  setOpen: React.Dispatch<React.SetStateAction<{ [x: string]: boolean }>>,
  open: { [x: string]: boolean },
  handleEditar: (itemEditing: PageItem) => Promise<void>,
  itemActive: PageItem,
  padreId: string = ""
) => {
  return data
    .filter(({ padre }) => padre === padreId)
    .map((page) => {
      return (
        <React.Fragment key={page._id}>
          <StaticPage
            key={page._id}
            page={page}
            handleEditar={handleEditar}
            itemActive={itemActive}
            actionsJoins={[
              {
                ocultar: page.tipo !== "SECCION",
                color: "primary",
                Icon: open[page._id!] ? ExpandLess : ExpandMore,
                name: "Expandir",
                onClick: () => {
                  setOpen({ ...open, [page._id!]: !open[page._id!] });
                },
                tipo: "icono",
                size: "small",
              },
            ]}
          />
          {page.tipo === "SECCION" && (
            <TableRow sx={{ padding: 0 }}>
              <StyledTableCell colSpan={columns.length}>
                <Collapse in={open[page._id!]} timeout="auto" unmountOnExit>
                  <StyledContainerSubTable>
                    <TableTitle texto={page.nombre} align="left" />
                    <Box
                      display={"flex"}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                    ></Box>
                    <TablaLayout maxHeight="30vh">
                      <TableHeader columns={columns} />
                      <TableBody>
                        {data.length === 0 ? (
                          <TableNoData
                            length={columns.length}
                            title="No hay Pages"
                          />
                        ) : (
                          generarRows(
                            data,
                            setOpen,
                            open,
                            handleEditar,
                            itemActive,
                            page._id
                          )
                        )}
                      </TableBody>
                    </TablaLayout>
                  </StyledContainerSubTable>
                </Collapse>
              </StyledTableCell>
            </TableRow>
          )}
        </React.Fragment>
      );
    });
};

export const Page = ({ dontChangePath }: FromAnotherComponent) => {
  // Hooks de navegación y rutas.
  // Importaciones y definiciones de estado
  const navigate = useNavigate();
  const { noTienePermiso, data: dataPage, getPathPage } = usePageStore();

  const { path } = useMemo(() => getPathPage("Page", false), [dataPage]);
  const { setItemActive, setOpenModal, itemActive, openModal, itemDefault } =
    usePageStore();

  const [pagesData, setPagesData] = useState<PageItem[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const searchFunction = (newBuscando: boolean, value: string) => {
    setBuscando(newBuscando);
    setData({
      busqueda: value,
    });
  };

  // Uso de la función
  const setData = async ({ busqueda }: setDataProps) => {
    if (busqueda !== "") {
      const children = dataPage.filter((page) =>
        normalize(page.nombre).includes(normalize(busqueda))
      );
      const parents = getParents(children, dataPage);
      setBusqueda(busqueda);
      let uniqueArray = removeDuplicates([...children, ...parents]);
      const object: { [x: string]: boolean } = {};
      uniqueArray.forEach((pageUnique) => {
        object[pageUnique._id!] = true;
      });
      setOpen(object);
      setPagesData(uniqueArray);
    } else {
      setBusqueda(busqueda);
      setPagesData(dataPage);
    }
  };

  // Efectos secundarios para la sincronización con la URL y sockets.
  const { q = "", buscando: buscandoQuery } = queryString.parse(
    location.search
  ) as {
    q: string;
    buscando: string;
  };

  useEffect(() => {
    if (!dontChangePath) {
      let params = new URLSearchParams(window.location.search);
      params.set("q", busqueda);
      params.set("buscando", buscando ? "true" : "false");
      navigate(`?${params.toString()}`, { replace: true });
    }
  }, [busqueda, buscando]);

  useEffect(() => {
    if (dontChangePath) {
      setBuscando(false);
      setData({
        busqueda,
      });
    } else {
      const estaBuscando = Boolean(buscandoQuery === "true");
      setBuscando(estaBuscando);
      setData({
        busqueda: estaBuscando ? q : "",
      });
    }
  }, [dataPage]);
  useSocketEvents();
  const nuevoActive = useMemo(() => itemActive.crud?.agregando, [itemActive]);

  const actions: Action[] = [
    {
      color: "primary",
      Icon: Refresh,
      name: "Actualizar",
      onClick: () =>
        setData({
          busqueda: q,
        }),
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
    async (itemEditing: PageItem) => {
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
    [dataPage, itemActive]
  );
  const [open, setOpen] = useState<{ [x: string]: boolean }>({});
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
            element={<ModalRoute pagesData={dataPage} cargando={false} />}
          />
        </Routes>
        <Buscador
          label="Buscar por: Nombre"
          buscando={buscando}
          cargando={false}
          onSearch={(value) => searchFunction(true, value)}
          onSearchCancel={() => {
            searchFunction(false, "");
            setOpen({});
          }}
        />

        <TableTitle texto={path} />
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Acciones actions={actions} />
        </Box>
        <TablaLayout>
          <TableHeader columns={columns} />
          <TableBody>
            {pagesData.length === 0 ? (
              <TableNoData length={columns.length} title="No hay Page" />
            ) : (
              generarRows(pagesData, setOpen, open, handleEditar, itemActive)
            )}
          </TableBody>
        </TablaLayout>
      </PaperContainerPage>
    </>
  );
};

export default Page;
