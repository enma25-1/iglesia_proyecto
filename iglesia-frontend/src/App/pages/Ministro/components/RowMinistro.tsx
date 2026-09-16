import { useState } from "react";
import { StaticMinistro } from "./StaticMinistro";
import { EditableMinistro } from "./EditableMinistro";
import { MinistroActions, MinistroItem } from "../interfaces";
type RowMinistroProps = {
  ministro: MinistroItem;
  busqueda?: string;
} & MinistroActions;

export const RowMinistro = ({
  busqueda,
  ministro,
  ...funciones
}: RowMinistroProps) => {
  const [editando, setEditando] = useState(!Boolean(ministro._id));
  return (
    <>
      {editando ? (
        <EditableMinistro
          ministro={ministro}
          setEditando={setEditando}
          {...funciones}
        />
      ) : (
        <StaticMinistro
          busqueda={busqueda || ""}
          ministro={ministro}
          setEditando={setEditando}
          {...funciones}
        />
      )}
    </>
  );
};
