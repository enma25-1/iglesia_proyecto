import {
  getSDataConfirmacion,
  onSAgregarConfirmacion,
  onSClearStateConfirmacion,
  onSEditConfirmacion,
  onSEliminarConfirmacion,
  setSOpenModal,
  setSItemActive,
} from "../store";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/interfaces";
import { getConfirmaciones } from "../helpers";
import { Pagination, Sort } from "../../../../interfaces/global";
import {
  GetDataConfirmacion,
  ConfirmacionItem,
  BusquedaAvanzadaConfirmacion,
} from "..";
import { paginationDefault } from "../../../../helpers";
import {
  agregarConfirmacion,
  editarConfirmacion,
  eliminarConfirmacion,
} from "../helpers";
// import { useNavigate } from "react-router-dom";
export const useConfirmacionStore = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const { data, pagination, itemActive, itemDefault, openModal } = useSelector(
    (state: RootState) => state.confirmacion
  );

  const getDataConfirmacion: GetDataConfirmacion = async ({
    pagination,
    sort,
    busqueda,
    busquedaAvanzada,
  }: {
    pagination: Pagination;
    sort: Sort;
    busqueda: string;
    busquedaAvanzada: BusquedaAvanzadaConfirmacion;
  }) => {
    const {
      error,
      result: { docs, ...paginationResult },
    } = await getConfirmaciones({
      pagination,
      sort,
      busqueda,
      busquedaAvanzada,
    });

    if (error.error) {
      return { paginationResult: paginationDefault, error };
    }

    dispatch(getSDataConfirmacion({ docs, paginationResult }));
    return {
      paginationResult,
      error: {
        error: false,
        msg: "",
      },
    };
    // navigate(`?pagination=${JSON.stringify(pagination)}`);
  };

  const onAgregarConfirmacion = async (item: ConfirmacionItem) => {
    const { result, ...error } = await agregarConfirmacion(item);
    if (!error.error && result) {
      dispatch(onSAgregarConfirmacion(result));
    }

    return error;
  };

  const onEditConfirmacion = async (item: ConfirmacionItem) => {
    const { result, ...error } = await editarConfirmacion(item);
    if (!error.error && result) {
      dispatch(onSEditConfirmacion(result));
    }
    return error;
  };

  const onEliminarConfirmacion = async (_id: string) => {
    console.log({ _id });

    const error = await eliminarConfirmacion({ _id });
    console.log(error);

    if (!error.error) {
      dispatch(onSEliminarConfirmacion(_id));
    }
    return error;
  };

  const onClearStateConfirmacion = () => {
    dispatch(onSClearStateConfirmacion());
  };
  const setOpenModal = (agregando: boolean) => {
    dispatch(setSOpenModal(agregando));
  };
  const setItemActive = (confirmacionToActive: ConfirmacionItem) => {
    dispatch(setSItemActive(confirmacionToActive));
  };
  return {
    //* METODOS
    getDataConfirmacion,
    // setAgregando,
    onAgregarConfirmacion,
    onEditConfirmacion,
    onEliminarConfirmacion,
    onClearStateConfirmacion,
    //* DE MOODAL
    setOpenModal,
    setItemActive,
    //*VALORES
    data,
    pagination,
    openModal,
    itemActive,
    itemDefault,
  };
};
