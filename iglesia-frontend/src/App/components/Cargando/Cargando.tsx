 
import { Box, CircularProgress, Typography } from "@mui/material";
import "./Cargando.css";
export const Cargando = ({ titulo = "Cargando" }: { titulo?: string }) => {
  return (
    <Box
      display="flex"
      height="100%"
      justifyContent="center"
      flexDirection="column"
      alignItems="center"
    >
      <Box className="animate__animated animate__infinite animate__jackInTheBox">
        <CircularProgress size='5rem' />
      </Box>
      <Typography
        marginTop={3}
        variant="h5"
        color="primary"
        width="100%"
        textAlign="center"
        textTransform="uppercase"
        fontWeight={"bold"}
        fontStyle={"italic"}
      >
        {titulo}
      </Typography>
    </Box>
  );
};
