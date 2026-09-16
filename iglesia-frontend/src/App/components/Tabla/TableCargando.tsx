import { TableBody, TableCell, TableRow } from "@mui/material";
import { Cargando } from "../Cargando/Cargando";

export const TableCargando = ({ columnsLength }: { columnsLength: number }) => {
  return (
    <TableBody>
      <TableRow>
        <TableCell colSpan={columnsLength + 1}>
          <Cargando titulo="Cargando Usuarios..." />
        </TableCell>
      </TableRow>
    </TableBody>
  );
};
