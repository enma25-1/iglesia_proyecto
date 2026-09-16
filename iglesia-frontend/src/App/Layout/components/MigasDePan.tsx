import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { useLocation, Link as RouterLink } from "react-router-dom";

export const MigasDePan = () => {
  const location = useLocation();

  const pathnames = location.hash.split("/").filter((x) => x);

  return (
    <Breadcrumbs aria-label="breadcrumb">
      <Link underline="hover" color="inherit" component={RouterLink} to="/">
        Inicio
      </Link>
      {pathnames.map((value, index) => {
        const to = "/" + pathnames.slice(0, index + 1).join("/");
        const isLast = index === pathnames.length - 1;
        return isLast ? (
          <Typography color="text.primary" key={to}>
            {decodeURIComponent(value)}
          </Typography>
        ) : (
          <Link
            underline="hover"
            color="inherit"
            component={RouterLink}
            to={to}
            key={to}
          >
            {decodeURIComponent(value)}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};
