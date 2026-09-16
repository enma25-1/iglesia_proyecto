import { AppBar, ListItem, Paper, Theme, styled } from "@mui/material";
import { Box } from "@mui/material";
import { agregarTransparencia } from "../../../../helpers";
export const LayoutBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "100vh",
  overflow: "hidden",
  ".row": {
    flexDirection: "row",
  },
});

export const LayoutBox2 = styled(Paper)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  width: "100%",
  height: "100%",
  overflow: "auto",
  paddingTop: ".4rem",
  ".swal2-container": {
    zIndex: 1301,
  },
  ".swal2-popup": {
    background: "red",
  },
});

// export const ContentBox = styled(Box)<{
//   drawerwidthclose: number;
//   drawerwidthopen: number;
//   ismddown: boolean;
//   opendrawersidebar: boolean;
// }>(({ drawerwidthclose, drawerwidthopen, ismddown, opendrawersidebar }) => ({

// }));

export const AppBarHeader = styled(AppBar)(({ theme }: { theme: Theme }) => ({
  // background: theme.palette.primary.main,
  // background: `linear-gradient(0deg, ${agregarTransparencia(
  //   theme.palette.primary.dark,
  //   0.4
  // )} 20%, ${agregarTransparencia(theme.palette.primary.light, 0.9)} 100%)`,
  // background: "transparent",
  boxShadow: "none",
  zIndex: theme.zIndex.drawer + 1,
  [theme.breakpoints.down("md")]: {
    zIndex: theme.zIndex.drawer,
  },
  ".toolbar": {
    height: theme.mixins.toolbar.minHeight,
    display: "flex",
    justifyContent: "space-between",
  },
  ".boxEmpresa": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    ".logoEmpresa": {
      mr: 1,
    },
    ".textoEmpresa": {
      [theme.breakpoints.down("md")]: {
        zIndex: theme.zIndex.drawer,
        fontSize: ".8rem",
      },
      fontSize: "1.5rem",

      mr: 2,
      fontFamily: "monospace",
      fontWeight: 700,
      letterSpacing: ".1rem",
      textDecoration: "none",
    },
  },
}));
export const AppBarFooter = styled(AppBar)(({ theme }: { theme: Theme }) => ({
  // background: "transparent", //theme.palette.primary.main,
  // background: `linear-gradient(0deg, ${agregarTransparencia(
  //   theme.palette.error.dark,
  //   0.6
  // )} 20%, ${agregarTransparencia(theme.palette.error.light, 0.7)} 100%)`,
  // background: "transparent",
  boxShadow: "none",
  zIndex: theme.zIndex.drawer + 1,
  [theme.breakpoints.down("md")]: {
    zIndex: theme.zIndex.drawer,
  },
  ".toolbar": {
    height: theme.mixins.toolbar.minHeight,
    display: "flex",
    justifyContent: "flex-end",
  },
  ".boxOnline": { display: "flex", alignItems: "center" },

  ".Typography": {
    marginRight: theme.spacing(1),
  },
}));

//SIDEBAR
export const StyledListItem = styled(ListItem)(
  ({ theme }: { theme: Theme }) => ({
    color: "red",
    ".link": {
      width: "100%",
      textDecoration: "none",
      color: theme.palette.primary.main,
    },

    ".link--active": {
      svg: { 
        color: theme.palette.primary.contrastText,
        transitionProperty: "background",
        transitionDuration: "0.5s",
      },
      background: agregarTransparencia(theme.palette.primary.light, 0.5),
      color: theme.palette.primary.contrastText,
      transitionProperty: "background",
      transitionDuration: "0.5s",
    },
  })
);
