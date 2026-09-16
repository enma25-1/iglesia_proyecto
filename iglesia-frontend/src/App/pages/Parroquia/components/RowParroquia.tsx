import { useState } from "react";
import { StaticParroquia } from "./StaticParroquia";
import { EditableParroquia } from "./EditableParroquia";
import { ParroquiaActions, ParroquiaItem } from "../interfaces";
type RowParroquiaProps = {
  parroquia: ParroquiaItem;
  busqueda?: string;
} & ParroquiaActions;

export const RowParroquia = ({
  busqueda,
  parroquia,
  ...funciones
}: RowParroquiaProps) => {
  const [editando, setEditando] = useState(!Boolean(parroquia._id));
  return (
    <>
      {editando ? (
        <EditableParroquia
          parroquia={parroquia}
          setEditando={setEditando}
          {...funciones}
        />
      ) : (
        <StaticParroquia
          busqueda={busqueda || ""}
          parroquia={parroquia}
          setEditando={setEditando}
          {...funciones}
        />
      )}
    </>
  );
};
