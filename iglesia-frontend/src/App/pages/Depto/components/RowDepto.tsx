import { useState } from "react";
import { StaticDepto } from "./StaticDepto";
import { EditableDepto } from "./EditableDepto";
import { DeptoItem } from "../interfaces";
import {
  StyledContainerSubTable,
  StyledTableCell,
} from "../../../components/style";
import { Collapse, TableRow } from "@mui/material";
import { TablaMunicipio } from "./Municipio/Municipio";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Action } from "../../../../interfaces/global";
import { columns } from "../helpers";

export const RowDepto = ({
  busqueda,
  depto,
}: {
  depto: DeptoItem;
  busqueda?: string;
}) => {
  const [editando, setEditando] = useState(!Boolean(depto._id));
  const [open, setopen] = useState(false);
  const actionsJoins: Action[] = [
    {
      color: "secondary",
      Icon: open ? ExpandLess : ExpandMore,
      name: `Ver municipios`,
      onClick: () => {
        setopen(!open);
      },
      tipo: "icono",
      size: "small",
    },
  ];
  return (
    <>
      {editando ? (
        <EditableDepto
          actionsJoins={actionsJoins}
          depto={depto}
          setEditando={setEditando}
        />
      ) : (
        <StaticDepto
          actionsJoins={actionsJoins}
          busqueda={busqueda || ""}
          depto={depto}
          setEditando={setEditando}
        />
      )}
      <TableRow sx={{ padding: 0 }}>
        <StyledTableCell colSpan={columns.length}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <StyledContainerSubTable>
              <TablaMunicipio depto={depto._id || ""} />
            </StyledContainerSubTable>
          </Collapse>
        </StyledTableCell>
      </TableRow>
    </>
  );
};
