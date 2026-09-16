import {
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { PageItem } from "../../../pages/Page";
import { StyledListItem } from "../styled";
import { NavLink } from "react-router-dom";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { ConvertirIcono } from "../../../../helpers";

export const SidebarItem = ({
  openSidebar,
  setOpen,
  open,
  page,
  newPath,
}: {
  openSidebar: boolean;
  setOpen: React.Dispatch<React.SetStateAction<{ [x: string]: boolean }>>;
  open: { [x: string]: boolean };
  newPath: string;
  page: PageItem;
}) => {
  return (
    <Tooltip title={page.nombre} followCursor placement="right">
      <StyledListItem disablePadding>
        <NavLink
          to={newPath}
          className={({ isActive }) => {
            if (isActive) {
              return "link link--active";
            }
            return "link";
          }}
        >
          <ListItemButton
            sx={{
              p: 0,
              py: 1,
            }}
          >
            <ListItemIcon
              sx={{
                display: "flex",
                justifyContent: "center",
          
              }}
            >
              {ConvertirIcono(page.icono, "medium", "primary")}
            </ListItemIcon>
            <ListItemText
              sx={{ padding: 0, margin: 0 }}
              primary={openSidebar ? page.nombre : ""}
            />
          </ListItemButton>
        </NavLink>
        {page.tipo === "SECCION" && (
          <IconButton
            sx={{
              display: "flex",
              justifyContent: "center",
              p: 0.75,
              margin: 0,
            }}
            onClick={() => {
              setOpen({ ...open, [page._id!]: !open[page._id!] });
            }}
          >
            {open[page._id!] ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        )}
      </StyledListItem>
    </Tooltip>
  );
};
