export interface AuthState {
  errorMessage?: string;
  status: "checking" | "authenticated" | "not-authenticated";
  usuario: Usuario;
  theme: "dark" | "light";
}

export type Roles = "ADMINISTRATIVO" | "OBISPO" | "ADMINISTRADOR" | "PARROCO";
export interface Usuario {
  username: string;
  estado: boolean;
  logo: string;
  lastname: string;
  dui?: string;
  name: string;
  online: boolean;
  photo?: string;
  rol: Roles;
  tel: string;
  uid: string;
  createdAt: string;
  updatedAt: string;
}
// FUNCIONES
export interface LoginParams {
  username: string;
  password: string;
}

export interface RegisterParams {
  username: string;
  lastname: string;
  name: string;
  password: string;
  tel: string;
}
