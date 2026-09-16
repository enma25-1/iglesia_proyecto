import {
  getSDataDepto,
  onSAddOrRemoveMunicipio,
  onSAgregarDepto,
  onSClearStateDepto,
  onSEditDepto,
  onSEliminarDepto,
  setSCargando,
} from "../store";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/interfaces";
import { getDeptos } from "../helpers";
import {
  Pagination,
  Sort,
  socketChildListener,
} from "../../../../interfaces/global";
import { DeptoItem } from "..";
import { paginationDefault } from "../../../../helpers";
// import { useNavigate } from "react-router-dom";
export const useDeptoStore = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const { data, cargando, pagination } = useSelector(
    (state: RootState) => state.depto
  );

  const getDataDepto = async ({
    pagination,
    sort,
    busqueda,
  }: {
    pagination: Pagination;
    sort: Sort;
    busqueda: string;
  }) => {
    dispatch(setSCargando(true));
    const {
      error,
      result: { docs, ...paginationResult },
    } = await getDeptos({ pagination, sort, busqueda });

    console.log({ docs, paginationResult, error });
    if (error.error) {
      return { paginationResult: paginationDefault, error };
    }

    dispatch(getSDataDepto({ docs, paginationResult }));
    return {
      paginationResult,
      error: {
        error: false,
        msg: "",
      },
    };
    // navigate(`?pagination=${JSON.stringify(pagination)}`);
  };
  const onEditDepto = (item: DeptoItem) => {
    dispatch(onSEditDepto(item));
  };
  const onAgregarDepto = (item: DeptoItem) => {
    dispatch(onSAgregarDepto(item));
  };
  // const setAgregando = (valorAgregando: boolean) => {
  // dispatch(setSAgregando(valorAgregando));
  // };

  const onEliminarDepto = (_id: string) => {
    dispatch(onSEliminarDepto(_id));
  };
  const onAddOrRemoveMunicipio = (data: {
    _id: string;
    tipo: socketChildListener;
  }) => {
    dispatch(onSAddOrRemoveMunicipio(data));
  };
  const onClearStateDepto = () => {
    dispatch(onSClearStateDepto());
  };
  return {
    //* METODOS
    getDataDepto,
    onEditDepto,
    // setAgregando,
    onAgregarDepto,
    onEliminarDepto,
    onAddOrRemoveMunicipio,
    onClearStateDepto,
    //*VALORES
    data,
    cargando,
    pagination,
  };
};
