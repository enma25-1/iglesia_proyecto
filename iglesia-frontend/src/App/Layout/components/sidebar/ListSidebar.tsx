import {
  Box,
  Collapse,
  IconButton,
  InputAdornment,
  List,
  TextField,
  Tooltip,
} from "@mui/material";

import { StyledListItem } from "../styled";
import { useAuthStore } from "../../../../hooks";
import {
  PageItem,
  getParents,
  removeDuplicates,
  usePageStore,
} from "../../../pages/Page";
import React, { useCallback, useMemo, useState } from "react";
import { convertirPath, normalize } from "../../../../helpers";
import { agregarTransparencia } from "../../../../helpers/ui/agregarTransparencia";
import { SidebarItem } from "./SidebarItem"; 
import { Cancel } from "@mui/icons-material";

const generarRutas = (
  data: PageItem[],
  openSidebar: boolean,
  setOpen: React.Dispatch<React.SetStateAction<{ [x: string]: boolean }>>,
  open: { [x: string]: boolean },
  padreId: string = "",
  path = ""
) => {
  return data
    .filter(({ padre }) => padre === padreId)
    .map((page) => {
      const newPath = path + convertirPath(page.nombre);
      return (
        <React.Fragment key={page._id}>
          <SidebarItem
            openSidebar={openSidebar}
            setOpen={setOpen}
            open={open}
            page={page}
            newPath={newPath}
          />
          {page.tipo == "SECCION" && (
            <Collapse in={open[page._id!]}>
              <List
                sx={{
                  background: (theme) =>
                    agregarTransparencia(theme.palette.secondary.light, 0.1),
                  p: 0,
                }}
              >
                {generarRutas(
                  data,
                  openSidebar,
                  setOpen,
                  open,
                  page._id,
                  newPath + "/"
                )}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      );
    });
};

export const ListSidebar = ({ openSidebar = true }) => {
  const [open, setOpen] = useState<{ [x: string]: boolean }>({});
  const { data } = usePageStore();
  const { usuario } = useAuthStore();
  const [busqueda, setbusqueda] = useState("");

  const onLeaveSearch = useCallback(() => {
    setOpen({});
    setbusqueda("");
  }, []);
  const dataFilter = useMemo(() => {
    const res = data.filter(({ ver }) => ver.includes(usuario.rol));
    if (busqueda !== "") {
      const children = data.filter((page) =>
        normalize(page.nombre).includes(busqueda)
      );
      const parents = getParents(children, data);
      let uniqueArray = removeDuplicates([...children, ...parents]);
      const object: { [x: string]: boolean } = {};
      uniqueArray.forEach((pageUnique) => {
        object[pageUnique._id!] = true;
      });
      setOpen(object);
      return uniqueArray;
    } else {
      setOpen({});
      return res;
    }
  }, [usuario, data, busqueda]);

  return (
    <Box sx={{ overflow: "auto" }}>
      <Tooltip title={"Buscar"} followCursor placement="right">
        <StyledListItem disablePadding>
          <TextField
            onChange={(e) => {
              setbusqueda(e.target.value);
            }}
            label="Buscar"
            variant="filled"
            color="primary"
            size="small"
            fullWidth
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                onLeaveSearch();
              }
            }}
            value={busqueda}
            name="search"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {busqueda !== "" && (
                    <IconButton 
                      aria-label="Cancelar Busqueda"
                      onClick={() => {
                        onLeaveSearch();
                      }}
                      color="error"
                    >
                      <Cancel />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />
        </StyledListItem>
      </Tooltip>
      <List>{generarRutas(dataFilter, openSidebar, setOpen, open)}</List>
    </Box>
  );
};

// export const ListSidebar = ({ openSidebar = true }) => {
//   const [open, setOpen] = useState<{ [x: string]: boolean }>({});
//   const { data } = usePageStore();
//   const { usuario } = useAuthStore();
//   const [busqueda, setbusqueda] = useState("");
//   const [buscando, setbuscando] = useState(false);

//   const dataFilter = useMemo(() => {
//     const res = data.filter(({ ver }) => ver.includes(usuario.rol));
//     if (busqueda !== "") {
//       const children = data.filter((page) =>
//         normalize(page.nombre).includes(busqueda)
//       );
//       const parents = getParents(children, data);
//       let uniqueArray = removeDuplicates([...children, ...parents]);
//       const object: { [x: string]: boolean } = {};
//       uniqueArray.forEach((pageUnique) => {
//         object[pageUnique._id!] = true;
//       });
//       setOpen(object);
//       return uniqueArray;
//     } else {
//       setOpen({});
//       return res;
//     }
//   }, [usuario, data, busqueda]);

//   return (
//     <Box sx={{ overflow: "auto" }}>
//       <Tooltip title={"Buscar"} followCursor placement="right">
//         <StyledListItem disablePadding>
//           <Buscador
//             buscando={buscando}
//             cargando={false}
//             onSearch={(e) => {
//               setbuscando(true);
//               setbusqueda(e);
//             }}
//             onSearchCancel={() => {
//               setbusqueda("");
//               setbuscando(false);
//             }}
//           />
//         </StyledListItem>
//       </Tooltip>
//       <List>{generarRutas(dataFilter, openSidebar, setOpen, open)}</List>
//     </Box>
//   );
// };
