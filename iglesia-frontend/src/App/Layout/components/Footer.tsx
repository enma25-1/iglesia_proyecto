import { Box, Toolbar, Typography } from "@mui/material";
import { OnlinePrediction } from "@mui/icons-material";
import { useAuthStore, useProvideSocket } from "../../../hooks";
import { AppBarFooter } from "./styled";

export const Footer = () => {
  const { online } = useProvideSocket();
  const { usuario } = useAuthStore();
  return (
    <AppBarFooter position="sticky">
      <Toolbar className="toolbar">
        <Box className="boxOnline">
          <Typography variant="h6" className="Typography">
            {usuario.name}
          </Typography>
          <OnlinePrediction color={online ? "success" : "error"} />
        </Box>
      </Toolbar>
    </AppBarFooter>
  );
};
