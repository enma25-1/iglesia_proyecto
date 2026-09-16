import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ConfirmacionItem, ConfirmacionState } from "../interfaces";
import { Pagination } from "../../../../interfaces/global";
import { paginationDefault } from "../../../../helpers";
import { itemDefault } from "../helpers";

const initialState: ConfirmacionState = {
  data: [],
  pagination: paginationDefault,
  openModal: false,
  itemActive: itemDefault,
  itemDefault,
};
export const confirmacionS = createSlice({
  name: "confirmacion",
  initialState,
  reducers: {
    getSDataConfirmacion: (
      state,
      action: PayloadAction<{
        docs: ConfirmacionItem[];
        paginationResult: Pagination;
      }>
    ) => {
      state.data = action.payload.docs;
      state.pagination = action.payload.paginationResult;
    },
    onSEditConfirmacion: (state, action: PayloadAction<ConfirmacionItem>) => {
      console.log(action.payload._id, state.data);

      state.data = state.data.map((item) =>
        item._id === action.payload._id
          ? { ...action.payload, crud: { editado: true } }
          : item
      );
    },
    onSAgregarConfirmacion: (
      state,
      action: PayloadAction<ConfirmacionItem>
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
    onSEliminarConfirmacion: (state, action: PayloadAction<string>) => {
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
    setSItemActive: (state, action: PayloadAction<ConfirmacionItem>) => {
      state.itemActive = action.payload;
    },
    onSClearStateConfirmacion: () => {
      return initialState;
    },
    // setSAgregando: (state, action: PayloadAction<boolean>) => {
    //   state.agregando = action.payload;
    // },
  },
});
export const {
  getSDataConfirmacion,
  onSAgregarConfirmacion,
  onSEditConfirmacion,
  onSEliminarConfirmacion,
  // setSAgregando,
  onSClearStateConfirmacion,
  setSOpenModal,
  setSItemActive,
} = confirmacionS.actions;
