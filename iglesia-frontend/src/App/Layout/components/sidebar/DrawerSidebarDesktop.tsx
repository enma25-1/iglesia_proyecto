import { Drawer, Toolbar } from "@mui/material";
import { ListSidebar } from "./ListSidebar";
import { useUiStore } from "../../../../hooks";

export const DrawerSidebarDesktop = ({
  drawerWidthClose,
  drawerWidthOpen,
}: {
  drawerWidthClose: number;
  drawerWidthOpen: number;
}) => {
  const { openDrawerSidebar } = useUiStore();
  return (
    <Drawer
      variant={"permanent"}
      sx={{
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          borderRight: "none",
          transitionDuration: ".3s",
          transitionProperty: "width",
          width: openDrawerSidebar ? drawerWidthOpen : drawerWidthClose,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <ListSidebar openSidebar={openDrawerSidebar} />
      <Toolbar />
    </Drawer>
  );
};
