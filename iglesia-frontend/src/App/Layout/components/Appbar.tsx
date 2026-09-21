import * as React from "react";
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  Switch,
  useMediaQuery,
} from "@mui/material";
import { AppBarHeader } from "./styled";
import { DarkMode, LightMode, MenuTwoTone } from "@mui/icons-material";
import { useAuthStore, useUiStore } from "../../../hooks";
import { ModalProfile } from "./ModalProfile";
import { clienteAxios } from "../../../api";
export const Appbar = () => {
  const { onStartLogout, usuario, theme, toggleDarkMode } = useAuthStore();
  const { onToogleSidebar, onToogleSidebarMobile, setOpenProfileModal } =
    useUiStore();

  const [anchorElUsuario, setAnchorElUsuario] =
    React.useState<null | HTMLElement>(null);

  const handleOpenUsuarioMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUsuario(event.currentTarget);
  };
  const handleCloseUsuarioMenu = () => {
    setAnchorElUsuario(null);
  };
  const isMdDown = useMediaQuery((theme: any) => theme.breakpoints.down("md"));

  return (
    <>
      <ModalProfile />
      <AppBarHeader position="sticky">
        <Toolbar disableGutters className="toolbar">
          {isMdDown ? (
            <IconButton
              size="large"
              aria-label="cuenta del usuario actual"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={onToogleSidebarMobile}
            >
              <MenuTwoTone />
            </IconButton>
          ) : (
            <IconButton
              size="large"
              aria-label="cuenta del usuario actual"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={onToogleSidebar}
            >
              <MenuTwoTone />
            </IconButton>
          )}

          <Box className="boxEmpresa">
            <Typography variant="subtitle2" noWrap className="textoEmpresa">
              SISTEMA SACRAMENTAL - DIOCESIS DE SONSONATE
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1} sx={{ mr: 1 }}>
            <LightMode
              fontSize="small"
              color={theme === "light" ? "warning" : "disabled"}
              sx={{ mr: 0.25 }}
            />
            <Switch
              checked={theme === "dark"}
              onChange={() =>
                toggleDarkMode(theme === "dark" ? "light" : "dark")
              }
              color="default"
              inputProps={{ "aria-label": "cambiar tema" }}
              icon={<LightMode />}
              checkedIcon={<DarkMode />}
            />
            <DarkMode
              fontSize="small"
              color={theme === "dark" ? "primary" : "disabled"}
              sx={{ ml: 0.25 }}
            />
            <Tooltip title="Abrir menú de usuario">
              <IconButton onClick={handleOpenUsuarioMenu}>
                <Avatar
                  alt="Foto"
                  src={`${clienteAxios.defaults.baseURL}${usuario.photo}` || ""}
                />
                <Avatar
                  alt="Logo"
                  src={`${clienteAxios.defaults.baseURL}${usuario.logo}` || ""}
                />
              </IconButton>
            </Tooltip>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElUsuario}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              open={Boolean(anchorElUsuario)}
              onClose={handleCloseUsuarioMenu}
            >
              <MenuItem
                onClick={() => {
                  setOpenProfileModal(true);
                }}
              >
                <Typography
                  width={"100%"}
                  textAlign={"center"}
                  color={"primary"}
                >
                  MIS DATOS
                </Typography>
              </MenuItem>
              <MenuItem onClick={onStartLogout}>
                <Typography width={"100%"} textAlign={"center"} color={"error"}>
                  CERRAR SESIÓN
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBarHeader>
    </>
  );
};
