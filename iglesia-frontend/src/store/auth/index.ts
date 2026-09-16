import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, Usuario } from "../interfaces";

const initialState: AuthState = {
  status: "checking",
  usuario: {
    name: "",
    username: "",
    online: false,
    uid: "",
    dui: "",
    estado: true,
    lastname: "",
    rol: "ADMINISTRADOR",
    tel: "",
    createdAt: "",
    updatedAt: "",
    logo: "",
  }, // Initialize with the default values
  errorMessage: undefined,
  theme: (localStorage.getItem("theme") as "dark" | "light") ?? "dark",
};

export const authS = createSlice({
  name: "auth",
  initialState,
  reducers: {
    onSchecking: (state) => {
      state.status = "checking";
      state.usuario = initialState.usuario; // Reset to the default values
      state.errorMessage = undefined;
    },
    onSLogin: (state, action: PayloadAction<Usuario>) => {
      state.status = "authenticated";
      state.usuario = action.payload;
      state.errorMessage = undefined;
    },
    onSLogout: (state, action: PayloadAction<string | undefined>) => {
      state.status = "not-authenticated";
      state.usuario = initialState.usuario; // Reset to the default values
      state.errorMessage = action.payload;
    },
    clearErrorMessage: (state) => {
      state.errorMessage = undefined;
    },
    onSEditUsuario: (state, action: PayloadAction<Usuario>) => {
      state.usuario = action.payload;
    },
    onStoggleDarkMode: (state, action: PayloadAction<"dark" | "light">) => {
      state.theme = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  onSchecking,
  onSLogin,
  onSLogout,
  clearErrorMessage,
  onSEditUsuario,
  onStoggleDarkMode,
} = authS.actions;
