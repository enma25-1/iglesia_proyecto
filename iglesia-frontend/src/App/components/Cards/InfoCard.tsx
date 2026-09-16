import Typography from "@mui/material/Typography";
import { Card, CardContent, CardHeader } from "@mui/material";

import { agregarTransparencia } from "../../../helpers";
// const chartSetting = {
export const InfoCard = ({
  titulo,
  Icono,
  desc,
  onClick,
  extraSize,
  desc2,
}: {
  titulo: string;
  Icono: JSX.Element;
  desc: string;
  onClick: () => void;
  extraSize?: boolean;
  desc2?: string;
}) => {
  return (
    <Card
      onClick={onClick}
      sx={{
        borderRadius: (theme) => theme.spacing(0),
        cursor: "pointer",
        background: (theme) =>
          `linear-gradient(0deg, ${agregarTransparencia(
            theme.palette.secondary.dark,
            0.2
          )} 20%, ${agregarTransparencia(
            theme.palette.secondary.dark,
            0.6
          )} 100%)`,
        transition: "all .5s",

        ":hover": {
          borderRadius: (theme) => theme.spacing(5),
          transform: "scale(1.05)",
          opacity: 0.9,
        },
      }}
    >
      <CardHeader
        sx={{
          textTransform: "uppercase",
        }}
        avatar={Icono}
        titleTypographyProps={{
          fontSize: extraSize ? "1.75rem" : "",
        }}
        title={titulo}
      />

      <CardContent sx={{ py: 0 }}>
        <Typography fontSize={extraSize ? "1.5rem" : ""} variant="body2">
          {desc}
        </Typography>
        {desc2 && (
          <Typography fontSize={extraSize ? "1.5rem" : ""} variant="body2">
            {desc2}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
