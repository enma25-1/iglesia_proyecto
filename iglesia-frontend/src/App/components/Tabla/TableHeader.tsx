import { Box, TableHead, Tooltip, Typography } from "@mui/material";
import { StyledTableHeaderCell, StyledTableRow } from "../style";
import { Column, Sort } from "../../../interfaces/global";
import { ArrowDownward, ArrowUpward, ErrorOutline } from "@mui/icons-material";

export const TableHeader = ({
  columns,
  sort,
  sortFunction,
}: {
  columns: Column[];
  sort?: Sort;
  sortFunction?: (sort: Sort) => void;
}) => {
  return (
    <TableHead>
      <StyledTableRow>
        {columns.map((column) => (
          <StyledTableHeaderCell
            key={column.label}
            sx={{
              minWidth: column.minWidth,
              textAlign: column.align,
            }}
            sorteable={column.sortable ? 1 : 0}
            active={column.campo && column.campo === sort?.campo ? 1 : 0}
            onClick={() => {
              if (!sortFunction) return;
              if (!column.sortable) return;
              sortFunction({
                campo: column.campo || "",
                asc: column.campo === sort?.campo ? !sort?.asc : true,
              });
            }}
          >
            <Box
              display={"flex"}
              justifyContent={
                column.align === "center"
                  ? "center"
                  : column.align === "right"
                  ? "flex-end"
                  : ""
              }
              alignItems={"center"}
              width={"100%"}
            >
              <Typography
                component={"span"}
                sx={{ fontWeight: column.required ? "bold" : "normal" }}
              >
                {column.label}
              </Typography>

              {column.required && (
                <Tooltip title="Este campo es requerido" color="tertiary">
                  <ErrorOutline />
                </Tooltip>
              )}

              {sort &&
                sort?.campo === column.campo &&
                (sort?.asc ? (
                  <ArrowDownward fontSize="small" />
                ) : (
                  <ArrowUpward fontSize="small" />
                ))}
            </Box>
          </StyledTableHeaderCell>
        ))}
      </StyledTableRow>
    </TableHead>
  );
};
