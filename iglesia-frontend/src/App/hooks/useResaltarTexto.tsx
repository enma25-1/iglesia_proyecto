import Typography from "@mui/material/Typography";
export const useResaltarTexto = ({
  texto,
  busqueda,
}: {
  texto: string;
  busqueda: string;
}) => {
  if (busqueda === "") return texto;
  const index = texto.toLowerCase().indexOf(busqueda.toLowerCase());

  if (index !== -1) {
    const antes = texto.slice(0, index);
    const resaltado = texto.slice(index, index + busqueda.length);
    const despues = texto.slice(index + busqueda.length);

    return (
      <>
        {antes}
        <Typography
          variant="body1"
          sx={{
            color: (theme) => theme.palette.primary.contrastText,
            background: (theme) => theme.palette.primary.main,
          }}
          component={"span"}
        >
          {resaltado}
        </Typography>

        {despues}
      </>
    );
  }

  return texto;
};
