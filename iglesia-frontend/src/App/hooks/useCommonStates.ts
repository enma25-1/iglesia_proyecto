import { useState } from "react";
import { Sort } from "../../interfaces/global";

export const useCommonStates = (initialSort: Sort) => {
  const [agregando, setAgregando] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [sort, setSort] = useState<Sort>(initialSort);

  return {
    agregando,
    setAgregando,
    buscando,
    setBuscando,
    busqueda,
    setBusqueda,
    cargando,
    setCargando,
    sort,
    setSort,
  };
};
