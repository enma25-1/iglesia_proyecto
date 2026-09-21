import { FromAnotherComponent } from "../../../interfaces/global";
import { Confirmacion } from "./Confirmacion";

// Apartado "Confirmaciones Supletorias": reutiliza íntegramente el CRUD,
// el modal y la tabla de Confirmacion (misma colección/backend), fijando
// tipo="supletoria" y su propio nombre de página para el menú, la URL y
// los permisos por rol (ver seed: componente "Supletoria").
export const Supletoria = ({ dontChangePath }: FromAnotherComponent) => (
  <Confirmacion
    dontChangePath={dontChangePath}
    tipo="supletoria"
    pageName="Supletoria"
  />
);

export default Supletoria;
