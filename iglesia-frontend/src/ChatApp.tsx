import { HashRouter } from "react-router-dom";
import { AppRouter } from "./router";
import { Provider } from "react-redux";
import { store } from "./store";
import { AppTheme } from "./theme";
import { SocketProvider } from "./context/SocketContext";
import { Box } from "@mui/material";

export const IglesiaApp = () => {
  return (
    <Provider store={store}>
      <SocketProvider>
        <AppTheme>
          <HashRouter>
            <Box height={"100vh"}>
              <AppRouter />
            </Box>
          </HashRouter>
        </AppTheme>
      </SocketProvider>
    </Provider>
  );
};