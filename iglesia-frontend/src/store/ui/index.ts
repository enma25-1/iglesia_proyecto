import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UiState } from "../interfaces";

const initialState: UiState = {
  openDrawerSidebar: false,
  openDrawerSidebarMobile: false,
  openModalProfile: false,
};
export const uiS = createSlice({
  name: "ui",
  initialState,
  reducers: {
    onSToogleSidebar: (state) => {
      state.openDrawerSidebar = !state.openDrawerSidebar;
    },
    onSToogleSidebarMobile: (state) => {
      state.openDrawerSidebarMobile = !state.openDrawerSidebarMobile;
    },
    setSOpenProfileModal: (state, action: PayloadAction<boolean>) => {
      state.openModalProfile = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  onSToogleSidebar,
  onSToogleSidebarMobile,
  setSOpenProfileModal,
} = uiS.actions;
