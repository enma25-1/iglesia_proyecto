import { Box, Divider, Typography } from "@mui/material";
import { Action } from "../../../interfaces/global";
import { Acciones } from "../Botones/Acciones";

export const TableTitle = ({
  texto,
  align = "center",
  Tabs = [],
}: {
  texto: string;
  align?: "center" | "left" | "right";
  Tabs?: Action[];
}) => {
  return (
    <>
      <Box display={"flex"} alignItems={"center"} flexWrap={"wrap-reverse"} mt={.25}>
        <Box overflow={"auto"}>
          <Acciones actions={Tabs} />
        </Box>
        <Divider textAlign={align} sx={{ flexGrow: 1 }}>
          <Typography
            variant="subtitle1"
            textTransform={"uppercase"}
            color={"secondary"}
          >
            {texto}
          </Typography>
        </Divider>
      </Box>
      <Divider />
    </>
  );
};
