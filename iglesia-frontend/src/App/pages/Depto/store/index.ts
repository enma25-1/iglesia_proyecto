import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DeptoItem, DeptoState } from "../interfaces";
import { Pagination, socketChildListener } from "../../../../interfaces/global";
import { paginationDefault } from "../../../../helpers";

const initialState: DeptoState = {
  cargando: true,
  data: [],
  pagination: paginationDefault,
};
export const deptoS = createSlice({
  name: "depto",
  initialState,
  reducers: {
    setSCargando: (state, action: PayloadAction<boolean>) => {
      state.cargando = action.payload;
    },
    getSDataDepto: (
      state,
      action: PayloadAction<{
        docs: DeptoItem[];
        paginationResult: Pagination;
      }>
    ) => {
      state.data = action.payload.docs;
      state.pagination = action.payload.paginationResult;
      state.cargando = false;
    },
    onSEditDepto: (state, action: PayloadAction<DeptoItem>) => {
      state.data = state.data.map((item) =>
        item._id === action.payload._id
          ? { ...action.payload, crud: { editado: true } }
          : item
      );
    },
    onSAddOrRemoveMunicipio: (
      state,
      action: PayloadAction<{
        _id: string;
        tipo: socketChildListener;
      }>
    ) => {
      state.data = state.data.map((item) =>
        item._id === action.payload._id
          ? {
              ...item,
              crud: { editado: true },
              totalMunicipios:
                action.payload.tipo === "add"
                  ? item.totalMunicipios! + 1
                  : action.payload.tipo === "remove"
                  ? item.totalMunicipios! - 1
                  : item.totalMunicipios,
            }
          : item
      );
    },
    onSAgregarDepto: (state, action: PayloadAction<DeptoItem>) => {
      state.data.unshift({
        ...action.payload,
        totalMunicipios: 0,
        crud: {
          nuevo: true,
        },
      });
      state.pagination = {
        ...state.pagination,
        totalDocs: state.pagination.totalDocs + 1,
      };
    },
    onSEliminarDepto: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter((item) => item._id !== action.payload);
      state.pagination = {
        ...state.pagination,
        totalDocs: state.pagination.totalDocs - 1,
      };
    },
    onSClearStateDepto: () => {
      return initialState;
    },
    // setSAgregando: (state, action: PayloadAction<boolean>) => {
    //   state.agregando = action.payload;
    // },
  },
});
export const {
  getSDataDepto,
  onSAgregarDepto,
  onSEditDepto,
  onSEliminarDepto,
  // setSAgregando,
  setSCargando,
  onSAddOrRemoveMunicipio,
  onSClearStateDepto,
} = deptoS.actions;
