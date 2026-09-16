import { StyledTableCell, StyledTableRow } from "../../../components/style";

import { PageItem } from "..";
import { Action } from "../../../../interfaces/global";
import { ConvertirIcono } from "../../../../helpers";
import { Acciones } from "../../../components";
import { Create } from "@mui/icons-material";
import { Box } from "@mui/material";

export const StaticPage = ({
  page,
  actionsJoins = [],
  handleEditar,
  itemActive,
}: {
  page: PageItem;
  actionsJoins?: Action[];
  handleEditar: (itemEditing: PageItem) => void;
  itemActive: PageItem;
}) => {
  return (
    <>
      <StyledTableRow
        key={page._id}
        crud={page.crud}
        onDoubleClick={() => {
          handleEditar(page);
        }}
      >
        <StyledTableCell padding="checkbox">
          <Acciones
            actions={[
              {
                color: itemActive?._id === page._id ? "secondary" : "primary",
                Icon: Create,
                name: `Editar`,
                onClick: () => {
                  handleEditar(page);
                },
                tipo: "icono",
                size: "small",
              },

              // {
              //   badge: String(page.stocks.length),
              //   color: "secondary",
              //   Icon: expandir ? ExpandLess : ExpandMore,
              //   name: `Ver stocks`,
              //   onClick: async () => {
              //     // const res = await clienteAxios.post(
              //     //   "/page/getPageStock",
              //     //   {
              //     //     _id: page._id,
              //     //   }
              //     // );

              //     setexpandir(!expandir);
              //   },
              //   tipo: "icono",
              //   size: "small",
              // },
              ...actionsJoins,
            ]}
          ></Acciones>
        </StyledTableCell>
        <>
          <StyledTableCell>{page.nombre}</StyledTableCell>
          <StyledTableCell>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {ConvertirIcono(page.icono, "small")}
            </Box>
          </StyledTableCell>
          <StyledTableCell>{page.delete.join(", ")}</StyledTableCell>
          <StyledTableCell>{page.insert.join(", ")}</StyledTableCell>
          <StyledTableCell>{page.update.join(", ")}</StyledTableCell>
          {/* <StyledTableCell>{page.select.join(", ")}</StyledTableCell> */}
          <StyledTableCell>{page.ver.join(", ")}</StyledTableCell>
        </>
      </StyledTableRow>
    </>
  );
};
