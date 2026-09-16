import { Table } from "@mui/material";
import { StyledTableContainer } from "../style";

export const TablaLayout = ({
  children,
  maxHeight,
}: {
  maxHeight?: string;
  children: JSX.Element[];
}) => {
  return (
    <StyledTableContainer
      sx={{
        maxHeight,
      }}
      className={maxHeight ? "" : "animate__animated animate__faster animate__fadeInUp animate__faster"}
    >
      <Table size="small" stickyHeader aria-label="sticky table">
        {children}
      </Table>
    </StyledTableContainer>
  );
};
