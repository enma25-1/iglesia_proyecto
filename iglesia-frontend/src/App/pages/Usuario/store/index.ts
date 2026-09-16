import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UsuarioItem, UsuarioState } from "../interfaces";
import { Pagination } from "../../../../interfaces/global";
import { paginationDefault } from "../../../../helpers";
import { itemDefault } from "../helpers";

const initialState: UsuarioState = {
  data: [],
  pagination: paginationDefault,
  openModal: false,
  itemActive: itemDefault,
  itemDefault,
};
export const usuarioS = createSlice({
  name: "usuario",
  initialState,
  reducers: {
    getSDataUsuario: (
      state,
      action: PayloadAction<{
        docs: UsuarioItem[];
        paginationResult: Pagination;
      }>
    ) => {
      state.data = action.payload.docs;
      state.pagination = action.payload.paginationResult;
    },
    onSEditUsuario: (state, action: PayloadAction<UsuarioItem>) => {
      console.log(action.payload._id, state.data);

      state.data = state.data.map((item) =>
        item._id === action.payload._id
          ? { ...action.payload, crud: { editado: true } }
          : item
      );
    },
    onSAgregarUsuario: (
      state,
      action: PayloadAction<UsuarioItem>
    ) => {
      state.data.unshift({
        ...action.payload,
        crud: {
          nuevo: true,
        },
      });
      state.pagination = {
        ...state.pagination,
        totalDocs: state.pagination.totalDocs + 1,
      };
    },
    onSEliminarUsuario: (state, action: PayloadAction<string>) => {
      console.log(action.payload);

      state.data = state.data.filter((item) => item._id !== action.payload);
      state.pagination = {
        ...state.pagination,
        totalDocs: state.pagination.totalDocs - 1,
      };
    },

    setSOpenModal: (state, action: PayloadAction<boolean>) => {
      state.openModal = action.payload;
    },
    setSItemActive: (state, action: PayloadAction<UsuarioItem>) => {
      state.itemActive = action.payload;
    },
    onSClearStateUsuario: () => {
      return initialState;
    },
    // setSAgregando: (state, action: PayloadAction<boolean>) => {
    //   state.agregando = action.payload;
    // },
  },
});
export const {
  getSDataUsuario,
  onSAgregarUsuario,
  onSEditUsuario,
  onSEliminarUsuario,
  // setSAgregando,
  onSClearStateUsuario,
  setSOpenModal,
  setSItemActive,
} = usuarioS.actions;
