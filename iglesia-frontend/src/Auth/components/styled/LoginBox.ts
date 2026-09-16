 
import { agregarTransparencia } from "../../../helpers";
import { Box, Theme, styled } from "@mui/material";

export const LoginBox = styled(Box)(({ theme }: { theme: Theme }) => ({
  position: "relative",
  width: "100%",
  height: "100vh",
  display: "flex",
  ".imgBx": {
    [theme.breakpoints.down("md")]: {
      position: "absolute",
      width: "100%",
      top: 0,
      left: 0,
    },
    position: "relative",
    width: "65%",
    height: "100%",
    ":before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      height: "100%",
      width: "100%",
      // background: `linear-gradient(225deg, ${theme.palette.primary.light}, ${theme.palette.secondary.dark})`,
      zIndex: 1,
      mixBlendMode: "screen",
    },
    " img": {
      position: "absolute",
      top: 0,
      left: 0,
      height: "100%",
      width: "100%",
      objectFit: "cover",
    },
  },
  ".contentBx": {
    [theme.breakpoints.down("md")]: {
      width: "100%",
      zIndex: 1,
      background: agregarTransparencia("rgb(18, 18, 18)", 0.75),
    },
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "35%",
    height: "100%",
    ".formBx": {
      [theme.breakpoints.down("md")]: {
        padding: "40px",
        width: "100%",
      //  background: agregarTransparencia(theme.palette.primary.dark, 0.9),
        margin: "2%",
      },
      width: "80%",
      h2: {
        fontWeight: "600",
        fontSize: "1.5rem",
        textTransform: "uppercase",
        marginBottom: "20px",
        borderBottom: `4px solid ${theme.palette.secondary.light}`,
         
        letterSpacing: "1px",
      },
    },
  },
}));
