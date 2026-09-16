import { createTheme } from "@mui/material";
import { red, deepOrange, green, blueGrey, blue } from "@mui/material/colors";

declare module "@mui/material/styles" {
  interface Palette {
    tertiary: Palette["primary"];
  }
  interface PaletteOptions {
    tertiary: PaletteOptions["primary"];
  }
}

export const purpleTheme = (theme: "dark" | "light") => {
  return createTheme({
    palette: {
      mode: theme,
      primary: { main: blue["600"] },
      secondary: { main: blueGrey["300"] },
      tertiary: { main: deepOrange["100"] },
      success: {
        main: green["600"],
      },
      error: {
        main: red["A400"],
      },
    },
    components: {
      MuiTextField: {
        defaultProps: {
          autoComplete: "off",
          variant: "standard",
        },
      },
      MuiAutocomplete: {
        defaultProps: {
          noOptionsText: "No hay opciones",
        },
      },
      MuiTablePagination: {
        defaultProps: { labelRowsPerPage: "Registros" },
      },
    },
    typography: {},
  });
};
