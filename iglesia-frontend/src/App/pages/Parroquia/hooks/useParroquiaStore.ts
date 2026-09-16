import {
  getSDataParroquia,
  onSAgregarParroquia,
  onSClearStateParroquia,
  onSEditParroquia,
  onSEliminarParroquia,
} from "../store";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/interfaces";
import { getParroquias } from "../helpers";
import { Pagination, Sort } from "../../../../interfaces/global";
import { GetDataParroquia, ParroquiaItem } from "..";
import { paginationDefault } from "../../../../helpers";
import {
  agregarParroquia,
  editarParroquia,
  eliminarParroquia,
} from "../helpers";
// import { useNavigate } from "react-router-dom";
export const useParroquiaStore = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const { data, pagination } = useSelector(
    (state: RootState) => state.parroquia
  );

  const getDataParroquia: GetDataParroquia = async ({
    pagination,
    sort,
    busqueda,
  }: {
    pagination: Pagination;
    sort: Sort;
    busqueda: string;
  }) => {
    const {
      error,
      result: { docs, ...paginationResult },
    } = await getParroquias({ pagination, sort, busqueda });

    if (error.error) {
      return { paginationResult: paginationDefault, error };
    }

    dispatch(getSDataParroquia({ docs, paginationResult }));
    return {
      paginationResult,
      error: {
        error: false,
        msg: "",
      },
    };
    // navigate(`?pagination=${JSON.stringify(pagination)}`);
  };

  const onAgregarParroquia = async (item: ParroquiaItem) => {
    const { result, ...error } = await agregarParroquia(item);
    if (!error.error && result) {
      dispatch(onSAgregarParroquia(result));
    }

    return error;
  };

  const onEditParroquia = async (item: ParroquiaItem) => {
    const { result, ...error } = await editarParroquia(item);
    if (!error.error && result) {
      dispatch(onSEditParroquia(result));
    }
    return error;
  };

  const onEliminarParroquia = async (_id: string) => {
    console.log({ _id });

    const error = await eliminarParroquia({ _id });
    console.log(error);

    if (!error.error) {
      dispatch(onSEliminarParroquia(_id));
    }
    return error;
  };

  const onClearStateParroquia = () => {
    dispatch(onSClearStateParroquia());
  };
  return {
    //* METODOS
    getDataParroquia,
    // setAgregando,
    onAgregarParroquia,
    onEditParroquia,
    onEliminarParroquia,
    onClearStateParroquia,
    //*VALORES
    data,
    pagination,
  };
};
