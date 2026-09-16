import { useMemo } from "react";
import { usePageStore } from "../Page";
import { StyledGridContainer } from "../../components/style";
import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material";
import {
  ConvertirIcono,
  agregarTransparencia,
  convertirPath,
} from "../../../helpers";
import { useNavigate } from "react-router-dom";
import { TableTitle } from "../../components";

const columns = {
  lg: 4,
  md: 2,
  xs: 1,
};
export const Seccion = () => {
  const { getChildren, data } = usePageStore();
  const { children, padreFind } = useMemo(() => {
    return getChildren();
  }, [data, location.hash]);

  const navigate = useNavigate();
  return (
    <StyledGridContainer {...columns}>
      <Box className="fullWidth">
        <TableTitle
          texto={`${padreFind?.nombre}: ${
            children.length === 0 ? "NO HAY MODULOS" : children.length
          } `}
        />
      </Box>

      {children.map((child) => (
        <Card
          onClick={() => {
            navigate(convertirPath(child.nombre));
          }}
          key={child._id}
          sx={{
            borderRadius: (theme) => theme.spacing(0),
            cursor: "pointer",
            background: (theme) =>
              `linear-gradient(45deg, ${agregarTransparencia(
                theme.palette.secondary.light,
                0.3
              )} 20%, ${agregarTransparencia(
                theme.palette.primary.light,
                0.55
              )} 100%)`,
            transition: "all .5s",

            ":hover": {
              borderRadius: (theme) => theme.spacing(5),
              transform: "scale(1.05)",
              opacity: 0.75,
            },
          }}
        >
          <CardHeader
            sx={{ textTransform: "uppercase" }}
            avatar={ConvertirIcono(child.icono, "large")}
            title={child.nombre}
          />

          <CardContent sx={{ py: 0 }}>
            <Typography variant="body2">{"SIN DESCRIPCIÓN"}</Typography>
          </CardContent>
        </Card>
      ))}
    </StyledGridContainer>
  );
};

export default Seccion;
