import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { PageState, PageItem, itemDefault } from "../";

const initialState: PageState = {
  openModal: false,
  itemActive: itemDefault,
  itemDefault,
  data: [],
  count: 0,
  cargando: true,
};

export const pageS = createSlice({
  name: "page",
  initialState,
  reducers: {
    getSDataPage: (state, action: PayloadAction<PageItem[]>) => {
      state.data = action.payload;
      state.cargando = false;
    },
    setSOpenModalPage: (state, action: PayloadAction<boolean>) => {
      state.openModal = action.payload;
    },
    setSItemActive: (state, action: PayloadAction<PageItem>) => {
      state.itemActive = action.payload;
    },
    onSAgregarPage: (state, action: PayloadAction<PageItem>) => {
      state.data.unshift({
        ...action.payload,
        crud: {
          nuevo: true,
        },
      });
    },
    onSEditPage: (state, action: PayloadAction<PageItem>) => {
      state.data = state.data.map((row) =>
        row._id === action.payload._id
          ? { crud: { editado: true }, ...action.payload }
          : row
      );
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  getSDataPage,
  onSAgregarPage,
  onSEditPage,
  setSItemActive,
  setSOpenModalPage,
} = pageS.actions;
