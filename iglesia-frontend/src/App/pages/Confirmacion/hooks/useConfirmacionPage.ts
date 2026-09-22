import {
  Action,
  Components,
  FromAnotherComponent,
} from "../../../../interfaces/global";
import { AddCircle, Cancel, Refresh } from "@mui/icons-material";
import { useCallback, useEffect, useMemo } from "react";
import { ConfirmacionItem, TipoConfirmacion } from "../interfaces";
import { itemDefault } from "../helpers";
import { paginationDefault } from "../../../../helpers";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";
import { usePageStore } from "../../Page";
import { useSetDataFunctions } from "./useSetDataFunctions";
import { sortDefault } from "../helpers";

interface UseConfirmacionPageProps extends FromAnotherComponent {
  getDataConfirmacion: (arg: {
    pagination: any;
    sort: any;
    busqueda: string;
    busquedaAvanzada: any;
  }) => Promise<any>;
  pagination: any;
  openModal: boolean;
  setItemActive: (item: ConfirmacionItem) => void;
  setOpenModal: (open: boolean) => void;
  // Permiten reutilizar este hook/página tanto para el apartado de
  // Confirmaciones normales como para el de Confirmaciones Supletorias.
  pageName?: Components;
  tipo?: TipoConfirmacion;
}

export const useConfirmacionPage = ({
  dontChangePath,
  getDataConfirmacion,
  pagination,
  openModal,
  setItemActive,
  setOpenModal,
  pageName = "Confirmacion",
  tipo = "normal",
}: UseConfirmacionPageProps) => {
  const navigate = useNavigate();
  const { noTienePermiso, data: dataMenu, getPathPage } = usePageStore();
  const { path } = useMemo(
    () => getPathPage(pageName, false),
    [dataMenu, pageName],
  );

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
    busquedaAvanzada,
  } = useSetDataFunctions({
    getDataConfirmacion,
    pagination,
    sortDefault,
  });

  // URL query parameters
  const {
    q = "",
    buscando: buscandoQuery,
    pagination: paginationQuery,
    sort: sortQuery,
    busquedaAvanzada: busquedaAvanzadaQuery,
  } = queryString.parse(location.search) as {
    q: string;
    buscando: string;
    pagination: string;
    sort: string;
    busquedaAvanzada: string;
  };

  // Effect: Sync URL with state
  useEffect(() => {
    if (!dontChangePath) {
      let params = new URLSearchParams(window.location.search);
      params.set("q", busqueda);
      params.set("buscando", buscando ? "true" : "false");
      params.set("sort", JSON.stringify(sort));
      params.set("pagination", JSON.stringify(pagination));
      params.set("busquedaAvanzada", JSON.stringify(busquedaAvanzada));
      navigate(`?${params.toString()}`, { replace: true });
    }
  }, [
    busqueda,
    buscando,
    sort,
    pagination,
    busquedaAvanzada,
    dontChangePath,
    navigate,
  ]);

  // Effect: Initialize state from URL or defaults
  useEffect(() => {
    if (dontChangePath) {
      const estaBuscando = Boolean(buscandoQuery === "true");
      setBuscando(estaBuscando);
      setData({
        pagination,
        sort,
        busqueda,
        busquedaAvanzada,
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
        busquedaAvanzada: busquedaAvanzadaQuery
          ? JSON.parse(busquedaAvanzadaQuery)
          : busquedaAvanzada,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Actions available in the UI
  const actions: Action[] = [
    {
      color: "primary",
      Icon: Refresh,
      name: "Actualizar",
      onClick: () =>
        setData({ pagination, sort, busqueda: q, busquedaAvanzada }),
      tipo: "icono",
    },
    {
      color: openModal ? "error" : "success",
      Icon: openModal ? Cancel : AddCircle,
      name:
        tipo === "supletoria"
          ? "Agregar Confirmación Supletoria"
          : "Agregar Confirmación",
      onClick: () => {
        setItemActive({ ...itemDefault, tipo });
        setOpenModal(true);
      },
      tipo: "icono",
    },
  ];

  const handleEditar = useCallback(
    async (itemEditing: ConfirmacionItem) => {
      if (noTienePermiso(pageName, "update")) {
        return;
      }

      await setItemActive(itemEditing);
      setOpenModal(true);
    },
    [noTienePermiso, setItemActive, setOpenModal, pageName],
  );

  const handleDateChange = useCallback(
    (field: "fecha1" | "fecha2", value: string) => {
      setData({
        pagination,
        sort,
        busqueda: q,
        busquedaAvanzada: { ...busquedaAvanzada, [field]: value },
      });
    },
    [pagination, sort, q, busquedaAvanzada, setData],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setData({ pagination, sort, busqueda: "", busquedaAvanzada });
        return;
      }
    },
    [pagination, sort, busquedaAvanzada, setData, actions],
  );

  return {
    // State
    buscando,
    busqueda,
    cargando,
    sort,
    busquedaAvanzada,
    path,
    // Handlers
    handleChangePage,
    handleChangeRowsPerPage,
    searchFunction,
    sortFunction,
    setData,
    handleEditar,
    handleDateChange,
    handleKeyDown,
    actions,
  };
};
