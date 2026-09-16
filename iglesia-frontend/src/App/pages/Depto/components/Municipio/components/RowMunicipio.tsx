import { useState } from "react";
import { StaticMunicipio } from "./StaticMunicipio";
import { EditableMunicipio } from "./EditableMunicipio";
import { MunicipioItem } from "../interfaces";
import {
  StyledContainerSubTable,
  StyledTableCell,
} from "../../../../../components/style";
import { Collapse, TableRow } from "@mui/material";
import { TablaDistrito } from "../../Distrito/Distrito";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { Action } from "../../../../../../interfaces/global";
import { columns } from "../helpers";

export const RowMunicipio = ({
  busqueda,
  depto,
  municipio,
}: {
  municipio: MunicipioItem;
  depto: string;
  busqueda?: string;
}) => {
  const [editando, setEditando] = useState(!Boolean(municipio._id));
  const [open, setopen] = useState(false);
  const actionsJoins: Action[] = [
    {
      color: "secondary",
      Icon: open ? ExpandLess : ExpandMore,
      name: `Ver distritos`,
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
        <EditableMunicipio
          actionsJoins={actionsJoins}
          municipio={municipio}
          depto={depto}
          setEditando={setEditando}
        />
      ) : (
        <StaticMunicipio
          actionsJoins={actionsJoins}
          busqueda={busqueda || ""}
          municipio={municipio}
          depto={depto}
          setEditando={setEditando}
        />
      )}
      <TableRow sx={{ padding: 0 }}>
        <StyledTableCell colSpan={columns.length + 1}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <StyledContainerSubTable>
              <TablaDistrito
                depto={depto}
                municipio={municipio._id || ""}
              />
            </StyledContainerSubTable>
          </Collapse>
        </StyledTableCell>
      </TableRow>
    </>
  );
};
