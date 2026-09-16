import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { MinistroItem, MinistroState } from "../interfaces";
import { Pagination } from "../../../../interfaces/global";
import { paginationDefault } from "../../../../helpers";

const initialState: MinistroState = {
  data: [],
  pagination: paginationDefault,
};
export const ministroS = createSlice({
  name: "ministro",
  initialState,
  reducers: {
    getSDataMinistro: (
      state,
      action: PayloadAction<{
        docs: MinistroItem[];
        paginationResult: Pagination;
      }>
    ) => {
      state.data = action.payload.docs;
      state.pagination = action.payload.paginationResult;
    },
    onSEditMinistro: (state, action: PayloadAction<MinistroItem>) => {
      const editedMinistro = action.payload;

      state.data = state.data.map((item) => {
        if (item._id === editedMinistro._id) {
          return {
            ...editedMinistro,
            crud: { editado: true },
          };
        }

        // Si el editado se activa, los demás se desactivan
        if (editedMinistro.estado === true && item.estado === true) {
          return {
            ...item,
            estado: false,
          };
        }

        return item;
      });
    },
    onSAgregarMinistro: (state, action: PayloadAction<MinistroItem>) => {
      const nuevoMinistro = action.payload;

      // Si el nuevo viene activo, desactiva a los demás
      if (nuevoMinistro.estado === true) {
        state.data = state.data.map((item) =>
          item.estado === true ? { ...item, estado: false } : item
        );
      }

      state.data.unshift({
        ...nuevoMinistro,
        crud: {
          nuevo: true,
        },
      });

      state.pagination = {
        ...state.pagination,
        totalDocs: state.pagination.totalDocs + 1,
      };
    },
    onSEliminarMinistro: (state, action: PayloadAction<string>) => {
      console.log(action.payload);

      state.data = state.data.filter((item) => item._id !== action.payload);
      state.pagination = {
        ...state.pagination,
        totalDocs: state.pagination.totalDocs - 1,
      };
    },
    onSClearStateMinistro: () => {
      return initialState;
    },
    // setSAgregando: (state, action: PayloadAction<boolean>) => {
    //   state.agregando = action.payload;
    // },
  },
});
export const {
  getSDataMinistro,
  onSAgregarMinistro,
  onSEditMinistro,
  onSEliminarMinistro,
  // setSAgregando,
  onSClearStateMinistro,
} = ministroS.actions;
