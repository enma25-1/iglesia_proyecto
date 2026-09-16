import { TableCell, TableRow, Typography } from "@mui/material";

export const TableNoData = ({
  length,
  title = "No hay data",
}: {
  length: number;
  title?: string;
}) => {
  return (
    <TableRow>
      <TableCell colSpan={length}>
        <Typography variant="subtitle2" color="error" textAlign={"center"}>
          {title}
        </Typography>
      </TableCell>
    </TableRow>
  );
};
