import {
  getSDataMinistro,
  onSAgregarMinistro,
  onSClearStateMinistro,
  onSEditMinistro,
  onSEliminarMinistro,
} from "../store";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/interfaces";
import { getMinistros } from "../helpers";
import { Pagination, Sort } from "../../../../interfaces/global";
import { GetDataMinistro, MinistroItem } from "..";
import { paginationDefault } from "../../../../helpers";
import {
  agregarMinistro,
  editarMinistro,
  eliminarMinistro,
} from "../helpers";
// import { useNavigate } from "react-router-dom";
export const useMinistroStore = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const { data, pagination } = useSelector(
    (state: RootState) => state.ministro
  );

  const getDataMinistro: GetDataMinistro = async ({
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
    } = await getMinistros({ pagination, sort, busqueda });

    if (error.error) {
      return { paginationResult: paginationDefault, error };
    }

    dispatch(getSDataMinistro({ docs, paginationResult }));
    return {
      paginationResult,
      error: {
        error: false,
        msg: "",
      },
    };
    // navigate(`?pagination=${JSON.stringify(pagination)}`);
  };

  const onAgregarMinistro = async (item: MinistroItem) => {
    const { result, ...error } = await agregarMinistro(item);
    if (!error.error && result) {
      dispatch(onSAgregarMinistro(result));
    }

    return error;
  };

  const onEditMinistro = async (item: MinistroItem) => {
    const { result, ...error } = await editarMinistro(item);
    if (!error.error && result) {
      dispatch(onSEditMinistro(result));
    }
    return error;
  };

  const onEliminarMinistro = async (_id: string) => {
    console.log({ _id });

    const error = await eliminarMinistro({ _id });
    console.log(error);

    if (!error.error) {
      dispatch(onSEliminarMinistro(_id));
    }
    return error;
  };

  const onClearStateMinistro = () => {
    dispatch(onSClearStateMinistro());
  };
  return {
    //* METODOS
    getDataMinistro,
    // setAgregando,
    onAgregarMinistro,
    onEditMinistro,
    onEliminarMinistro,
    onClearStateMinistro,
    //*VALORES
    data,
    pagination,
  };
};
