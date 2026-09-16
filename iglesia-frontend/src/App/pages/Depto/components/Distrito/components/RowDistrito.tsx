import { useState } from "react";
import { StaticDistrito } from "./StaticDistrito";
import { EditableDistrito } from "./EditableDistrito";
import { DistritoItem } from "../interfaces";

export const RowDistrito = ({
  busqueda,
  depto,
  distrito,
}: {
  depto: string;
  distrito: DistritoItem;
  busqueda?: string;
}) => {
  const [editando, setEditando] = useState(!Boolean(distrito._id));
  return (
    <>
      {editando ? (
        <EditableDistrito
          depto={depto}
          distrito={distrito}
          setEditando={setEditando}
        />
      ) : (
        <StaticDistrito
          busqueda={busqueda || ""}
          depto={depto}
          distrito={distrito}
          setEditando={setEditando}
        />
      )}
    </>
  );
};
