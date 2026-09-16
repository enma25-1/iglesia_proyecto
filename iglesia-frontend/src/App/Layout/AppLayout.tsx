import {
  Appbar,
  DrawerSidebarDesktop,
  DrawerSidebarMobile,
  Footer,
  MigasDePan,
} from "./components";
import { Cargando } from "../components";
import { LayoutBox, LayoutBox2 } from "./components/styled";
import {
  Backdrop,
  Box,
  CssBaseline,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Suspense, useEffect } from "react";
import { PageItem, usePageStore } from "../pages/Page";
import { useProvideSocket, useUiStore } from "../../hooks";
const drawerWidthClose = 95;
const drawerWidthOpen = 240;
export const AppLayout = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const { socket } = useProvideSocket();
  const { getDataPage, onEditPage, cargando } = usePageStore();
  const { openDrawerSidebar } = useUiStore();
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    getDataPage();
  }, []);
  useEffect(() => {
    socket?.on("cliente:page-editar", (data: PageItem) => {
      onEditPage(data);
    });
    return () => {
      socket?.off("cliente:page-editar");
    };
  }, [socket]);
  return (
    <>
      <CssBaseline />
      <LayoutBox>
        <Appbar />
        <LayoutBox className="row">
          {isMdDown ? (
            <DrawerSidebarMobile drawerWidthOpen={drawerWidthOpen} />
          ) : (
            <DrawerSidebarDesktop
              drawerWidthClose={drawerWidthClose}
              drawerWidthOpen={drawerWidthOpen}
            />
          )}
          <Box
            sx={{
              width: isMdDown
                ? "100%"
                : openDrawerSidebar
                ? `calc(100% - ${drawerWidthOpen}px)`
                : `calc(100% - ${drawerWidthClose}px)`,
              transitionDuration: "0.3s",
              transitionProperty: "width",
            }}
          >
            <Suspense fallback={<Cargando />}>
              <LayoutBox2>
                <MigasDePan />
                <LayoutBox2>
                  {cargando && (
                    <Backdrop
                      sx={{
                        color: "#fff",
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                      }}
                      open
                    >
                      <Cargando />
                    </Backdrop>
                  )}
                  {children}
                </LayoutBox2>
              </LayoutBox2>
            </Suspense>
          </Box>
        </LayoutBox>
        <Footer />
      </LayoutBox>
    </>
  );
};
