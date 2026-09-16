import { CssBaseline, ThemeProvider } from "@mui/material";
import { purpleTheme } from "./theme";
import { useAuthStore } from "../hooks";
import { useMemo } from "react";

export const AppTheme = ({ children }: { children: JSX.Element }) => {
  const { theme } = useAuthStore();
  const tema = useMemo(() => purpleTheme(theme), [theme]);
  return (
    <ThemeProvider theme={tema}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};
