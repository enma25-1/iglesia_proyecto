import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UsuarioItem, UsuarioState } from "../interfaces";
import { itemDefault } from "../helpers";

const initialState: UsuarioState = {
  openModal: false,
  itemActive: itemDefault,
  itemDefault,
};

export const usuarioS = createSlice({
  name: "usuario",
  initialState,
  reducers: {
    setSOpenModal: (state, action: PayloadAction<boolean>) => {
      state.openModal = action.payload;
    },
    setSItemActive: (state, action: PayloadAction<UsuarioItem>) => {
      state.itemActive = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSItemActive, setSOpenModal } = usuarioS.actions;
