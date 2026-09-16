import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ParroquiaItem, ParroquiaState } from "../interfaces";
import { Pagination } from "../../../../interfaces/global";
import { paginationDefault } from "../../../../helpers";

const initialState: ParroquiaState = { 
  data: [],
  pagination: paginationDefault,
};
export const parroquiaS = createSlice({
  name: "parroquia",
  initialState,
  reducers: {
 
    getSDataParroquia: (
      state,
      action: PayloadAction<{
        docs: ParroquiaItem[];
        paginationResult: Pagination;
      }>
    ) => {
      state.data = action.payload.docs;
      state.pagination = action.payload.paginationResult; 
    },
    onSEditParroquia: (state, action: PayloadAction<ParroquiaItem>) => {
      console.log(action.payload._id, state.data);

      state.data = state.data.map((item) =>
        item._id === action.payload._id
          ? { ...action.payload, crud: { editado: true } }
          : item
      );
    },
    onSAgregarParroquia: (state, action: PayloadAction<ParroquiaItem>) => {
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
    onSEliminarParroquia: (state, action: PayloadAction<string>) => {
      console.log(action.payload);

      state.data = state.data.filter((item) => item._id !== action.payload);
      state.pagination = {
        ...state.pagination,
        totalDocs: state.pagination.totalDocs - 1,
      };
    },
    onSClearStateParroquia: () => {
      return initialState;
    },
    // setSAgregando: (state, action: PayloadAction<boolean>) => {
    //   state.agregando = action.payload;
    // },
  },
});
export const {
  getSDataParroquia,
  onSAgregarParroquia,
  onSEditParroquia,
  onSEliminarParroquia,
  // setSAgregando, 
  onSClearStateParroquia,
} = parroquiaS.actions;
