import { Drawer } from "@mui/material";
import { ListSidebar } from "./ListSidebar";
import { useUiStore } from "../../../../hooks";
export const DrawerSidebarMobile = ({
  drawerWidthOpen,
}: {
  drawerWidthOpen: number;
}) => {
  const { openDrawerSidebarMobile, onToogleSidebarMobile } = useUiStore();

  return (
    <Drawer
      variant={"temporary"}
      onClose={onToogleSidebarMobile}
      open={openDrawerSidebarMobile}
      sx={{
        transitionProperty: "width",
        width: drawerWidthOpen,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          borderRight: "none",
          transitionDuration: ".3s",
          transitionProperty: "width",
          width: drawerWidthOpen,
          boxSizing: "border-box",
        },
      }}
    >
      <ListSidebar />
    </Drawer>
  );
};
