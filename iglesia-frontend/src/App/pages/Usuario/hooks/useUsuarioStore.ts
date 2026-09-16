import {
  getSDataUsuario,
  onSAgregarUsuario,
  onSClearStateUsuario,
  onSEditUsuario,
  onSEliminarUsuario,
  setSOpenModal,
  setSItemActive,
} from "../store";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../store/interfaces";
import { getUsuarios } from "../helpers";
import { GetDataUsuario, setDataProps, UsuarioItem } from "..";
import { paginationDefault } from "../../../../helpers";
import { agregarUsuario, editarUsuario, eliminarUsuario } from "../helpers";
// import { useNavigate } from "react-router-dom";
export const useUsuarioStore = () => {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const { data, pagination, itemActive, itemDefault, openModal } = useSelector(
    (state: RootState) => state.usuario,
  );
  const getDataUsuario: GetDataUsuario = async ({
    pagination,
    sort,
    busqueda,
    rol,
    estado,
  }: setDataProps) => {
    try {
      const {
        error,
        result: { docs, ...paginationResult },
      } = await getUsuarios({
        pagination,
        sort,
        busqueda,
        rol,
        estado,
      });

      console.log({ pagination, sort, busqueda, rol, estado, error });
      if (error.error) {
        return { paginationResult: paginationDefault, error };
      }

      console.log({ docs, paginationResult });
      dispatch(getSDataUsuario({ docs, paginationResult }));

      return {
        paginationResult,
        error: {
          error: false,
          msg: "",
        },
      };
    } catch (err: any) {
      console.error("getDataUsuario error:", err);
      return {
        paginationResult: paginationDefault,
        error: {
          error: true,
          msg: err?.message || "Error al obtener usuarios",
        },
      };
    }
  };

  const onAgregarUsuario = async (item: UsuarioItem) => {
    try {
      const { result, ...error } = await agregarUsuario(item);
      if (!error.error && result) {
        dispatch(onSAgregarUsuario(result));
      }
      return error;
    } catch (err: any) {
      return {
        error: true,
        msg: err?.message || "Error al agregar usuario",
      };
    }
  };

  const onEditUsuario = async (item: UsuarioItem, eliminados: string[]) => {
    try {
      const { result, ...error } = await editarUsuario(item, eliminados);
      console.log({ result, error });

      if (!error.error) {
        dispatch(onSEditUsuario(item));
      }
      return error;
    } catch (err: any) {
      console.error("onEditUsuario error:", err);
      return {
        error: true,
        msg: err?.message || "Error al editar usuario",
      };
    }
  };

  const onEliminarUsuario = async (_id: string) => {
    try {
      console.log({ _id });
      const error = await eliminarUsuario({ _id });
      console.log(error);
      if (!error.error) {
        dispatch(onSEliminarUsuario(_id));
      }
      return error;
    } catch (err: any) {
      console.error("onEliminarUsuario error:", err);
      return {
        error: true,
        msg: err?.message || "Error al eliminar usuario",
      };
    }
  };

  const onClearStateUsuario = () => {
    dispatch(onSClearStateUsuario());
  };
  const setOpenModal = (agregando: boolean) => {
    dispatch(setSOpenModal(agregando));
  };
  const setItemActive = (usuarioToActive: UsuarioItem) => {
    dispatch(setSItemActive(usuarioToActive));
  };
  return {
    //* METODOS
    getDataUsuario,
    // setAgregando,
    onAgregarUsuario,
    onEditUsuario,
    onEliminarUsuario,
    onClearStateUsuario,
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
