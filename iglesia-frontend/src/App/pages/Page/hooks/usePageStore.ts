import { RootState } from "../../../../store/interfaces";
import { useDispatch, useSelector } from "react-redux";
import { PageItem } from "../interfaces";
import {
  getSDataPage,
  onSAgregarPage,
  onSEditPage,
  setSItemActive,
  setSOpenModalPage,
} from "../store";
import { useThemeSwal } from "../../../hooks";
import Swal from "sweetalert2";
import { getPages } from "../../../Layout/helpers";
import { toast } from "react-toastify";
import { useCallback } from "react";
import { Components, tipoPermiso } from "../../../../interfaces/global";
import {
  ConvertirIcono,
  convertirPath,
  obtenerUltimaRuta,
} from "../../../../helpers";
export const usePageStore = () => {
  const { openModal, itemActive, itemDefault, data, cargando } = useSelector(
    (state: RootState) => state.page,
  );

  const themeSwal = useThemeSwal();
  const dispatch = useDispatch();

  const setOpenModal = (value: boolean) => {
    dispatch(setSOpenModalPage(value));
  };
  const setItemActive = async (
    itemToActive: PageItem,
    sinValidacion?: boolean,
  ) => {
    if (sinValidacion) {
      dispatch(setSItemActive(itemToActive));
      return true;
    }

    const isEditingToDefault =
      itemActive._id && !itemToActive.crud?.agregando && !itemToActive._id;

    const isNewToEditing = itemActive.crud?.agregando && itemToActive._id;

    const isDefaultToNew =
      !itemActive._id &&
      !itemActive.crud?.agregando &&
      itemToActive.crud?.agregando;

    const isDefaultToEdit =
      !itemActive._id && !itemActive.crud?.agregando && itemToActive._id;

    const isChangingStateWithNew =
      itemActive.crud?.agregando &&
      !itemToActive._id &&
      !itemToActive.crud?.agregando;

    const isChangingStateWitDefault =
      !itemActive._id &&
      !itemActive.crud?.agregando &&
      !itemToActive._id &&
      !itemToActive.crud?.agregando;
    const isEditingTheSame =
      itemActive._id === itemToActive._id && !itemActive.crud?.agregando;
    const isEditingAnother =
      itemActive._id !== itemToActive._id && itemActive._id;

    if (isEditingTheSame) {
      dispatch(setSItemActive(itemToActive));
      return true;
    }

    if (isChangingStateWithNew) {
      // dispatch(setSItemActive(itemToActive));
      return true;
    }

    if (isChangingStateWitDefault) {
      // dispatch(setSItemActive(itemToActive));
      return true;
    }

    if (isDefaultToNew || isDefaultToEdit) {
      dispatch(setSItemActive(itemToActive));
      return true;
    }
    // Si el page está cambiando de tab, actualiza el item estado
    if (isEditingToDefault) {
      const result = await Swal.fire({
        title: `Estás editando un page`,
        text: "Si realizas esta acción Los cambios no se guardarán.",
        icon: "warning",
        confirmButtonText: "Confirmar",
        ...themeSwal,
      });

      if (result.isConfirmed) {
        dispatch(setSItemActive(itemToActive));
        return true;
      }
      if (result.isDismissed) {
        return false;
      }
    }

    if (isNewToEditing) {
      const result = await Swal.fire({
        title: `Estás creando un page`,
        text: "Si realizas esta acción Los cambios no se guardarán.",
        icon: "warning",
        confirmButtonText: "Confirmar",
        ...themeSwal,
      });
      if (result.isConfirmed) {
        dispatch(setSItemActive(itemToActive));
        return true;
      }
    }
    if (isEditingAnother) {
      const result = await Swal.fire({
        title: `Estas editando un page`,
        text: "Si realizas esta acción Los cambios no se guardarán.",
        icon: "warning",
        confirmButtonText: "Confirmar",
        ...themeSwal,
      });
      if (result.isConfirmed) {
        dispatch(setSItemActive(itemToActive));
        return true;
      }
    }
    // Si el page está en el estado por defecto, no hace nada

    return false;
  };

  const {
    usuario: { rol },
  } = useSelector((state: RootState) => state.auth);

  const getDataPage = async () => {
    const { data, error } = await getPages();
    if (error.error) {
      toast.error(error.msg);
    }

    dispatch(getSDataPage(data));
  };

  const onAgregarPage = (item: PageItem) => {
    dispatch(onSAgregarPage(item));
  };

  const onEditPage = (item: PageItem) => {
    dispatch(onSEditPage(item));
  };
  const noTienePermiso = useCallback(
    (component: Components, tipoPermiso: tipoPermiso) => {
      const pageFind = data.find((page) => page.componente === component);
      if (!pageFind) {
        toast.error(`Error al validar permiso`);
        return false;
      }

      const sinPermiso = !pageFind[tipoPermiso].includes(rol);
      if (sinPermiso) {
        toast.error(`No tiene permiso para  ${tipoPermiso}`);
      }

      return sinPermiso;
    },
    [data, rol],
  );
  const getPathPage: (
    component: Components,
    withIcon?: boolean,
  ) => {
    path: string;
    Icono?: JSX.Element;
  } = (component: Components, withIcon = false) => {
    const res = data.find((itemPage) => itemPage.componente === component);
    if (withIcon) {
      return {
        path: convertirPath(res?.nombre || ""),
        Icono: ConvertirIcono(res?.icono),
      };
    } else {
      return {
        path: convertirPath(res?.nombre || ""),
      };
    }
  };
  const getChildren = (): {
    error: boolean;
    padreFind?: PageItem;
    children: PageItem[];
  } => {
    const ruta = obtenerUltimaRuta(location.hash); //location.path
    console.log({ ruta });

    const padreFind = data.find(
      (itemFinding) => convertirPath(itemFinding.nombre) === ruta,
    );
    console.log({ padreFind });

    if (!padreFind) {
      return {
        error: true,
        padreFind,
        children: [],
      };
    }
    console.log({ data });

    const children = data.filter(
      (pageFilter) => pageFilter.padre === padreFind._id,
    );
    return {
      error: false,
      padreFind,
      children,
    };
  };
  return {
    //Propiedades
    openModal,
    itemActive,
    data,
    itemDefault,
    cargando,
    //Metodos
    getDataPage,
    onEditPage,
    setOpenModal,
    setItemActive,
    noTienePermiso,
    getPathPage,
    onAgregarPage,
    getChildren,
  };
};
