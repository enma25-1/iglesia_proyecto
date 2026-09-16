import { Box, Divider, Typography } from "@mui/material";
import { Acciones } from "../Botones/Acciones";
import { Action } from "../../../interfaces/global";

export const ModalHeader = ({
  AccionesLeft,
  AccionesRight,
  texto,
  idModal = "",
}: {
  AccionesLeft: Action[];
  AccionesRight: Action[];
  texto: string;
  idModal?: string;
}) => {
  return (
    <>
      <Box display={"flex"} alignItems={"flex-start"} flexWrap={"wrap-reverse"}>
        <Box overflow={"auto"}>
          <Acciones actions={AccionesLeft} />
        </Box>
        <Box display={"flex"} alignItems={"center"} sx={{ flexGrow: 1 }}>
          <Divider
            sx={{ flexGrow: 1, cursor: "move" }}
            className="drag-handle"
            component={"div"}
            id={idModal}
          >
            <Box>
              <Typography
                variant="h6"
                textTransform={"uppercase"}
                color={"primary"}
              >
                {texto}
              </Typography>
            </Box>
          </Divider>
          <Acciones actions={AccionesRight} />
        </Box>
      </Box>
      <Divider />
    </>
  );
};
