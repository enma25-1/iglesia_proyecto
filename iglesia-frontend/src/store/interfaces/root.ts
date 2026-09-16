import { UiState } from ".";
import { AuthState } from "./auth";
import { PageState } from "../../App/pages/Page";
import { DeptoState } from "../../App/pages/Depto";
import { UsuarioState } from "../../App/pages/Usuario";
import { ParroquiaState } from "../../App/pages/Parroquia";
import { MinistroState } from "../../App/pages/Ministro";
import { ConfirmacionState } from "../../App/pages/Confirmacion";
export interface RootState {
  auth: AuthState;
  ui: UiState;
  page: PageState;
  depto: DeptoState;
  usuario: UsuarioState;
  parroquia: ParroquiaState;
  ministro: MinistroState;
  confirmacion: ConfirmacionState;
}
