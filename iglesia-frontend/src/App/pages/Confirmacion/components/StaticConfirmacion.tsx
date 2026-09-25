import { useCallback, useState } from "react";
import { StyledTableCell, StyledTableRow } from "../../../components/style";
import { useResaltarTexto, useThemeSwal } from "../../../hooks";
import { usePageStore } from "../../Page";
import { ConfirmacionActions, ConfirmacionItem } from "..";
import Swal from "sweetalert2";
import { Action, Components } from "../../../../interfaces/global";
import { formatearFechaSinHoras, handleSocket } from "../../../../helpers";
import { Acciones } from "../../../components";
import { getMinistroDisplayName } from "../../Ministro";
import {
  Create,
  DeleteForever,
  Download,
  PictureAsPdf,
  Visibility,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { clienteAxios } from "../../../../api";
import { saveAs } from "file-saver";

type ModoImpresion = "completo" | "encabezado_pie" | "cuerpo";

// "encabezado_pie" no depende de un confirmado específico (es una hoja en
// blanco genérica), así que ese modo vive aparte: ver el botón "Imprimir
// solo encabezado y pie" en el toolbar de la página (ModalImprimirEncabezadoPie).
const OPCIONES_VER_PDF: { modo: ModoImpresion; label: string }[] = [
  { modo: "completo", label: "Ver PDF completo" },
  { modo: "cuerpo", label: "Ver solo cuerpo (hoja ya firmada)" },
];
interface StaticConfirmacionProps extends ConfirmacionActions {
  confirmacion: ConfirmacionItem;
  busqueda: string;
  actionsJoins?: Action[];
  handleEditar: (itemEditing: ConfirmacionItem) => void;
  // Página desde la que se renderiza esta fila (Confirmacion o Supletoria),
  // usada para validar el permiso de eliminar contra el menú correcto.
  pageName?: Components;
}

export const StaticConfirmacion = ({
  confirmacion,
  busqueda,
  actionsJoins = [],
  onEliminarConfirmacion,
  handleEditar,
  pageName = "Confirmacion",
}: StaticConfirmacionProps) => {
  const themeSwal = useThemeSwal();
  const { noTienePermiso } = usePageStore();
  const [anchorElImpresion, setAnchorElImpresion] =
    useState<null | HTMLElement>(null);
  const onClickEditar = () => {
    handleEditar(confirmacion);
  };
  const verPdf = (modo: ModoImpresion) => {
    setAnchorElImpresion(null);
    try {
      window.open(
        `${clienteAxios.defaults.baseURL}/reporte/pdf?ID=${confirmacion._id}&modo=${modo}`,
        "_blank",
      );
    } catch (error: any) {}
  };
  const descargarPdf = async () => {
    setAnchorElImpresion(null);
    try {
      const res = await clienteAxios.get(
        `/reporte/pdf?ID=${confirmacion._id}`,
        {
          responseType: "blob",
        },
      );

      const pdfBlob = new Blob([res.data], {
        type: "application/pdf",
      });
      saveAs(
        pdfBlob,
        `Confirmacion: ${getMinistroDisplayName(confirmacion.ministro)} - ${confirmacion.nombres} ${confirmacion.apellidos}.pdf`,
      );
    } catch (error: any) {
      // const msg =
      //   error?.response?.data?.msg ||
      //   "Error al consultar los detalles de ventas";
    }
  };
  const handleEliminar = useCallback(() => {
    if (noTienePermiso(pageName, "delete")) return;
    Swal.fire({
      title: `Desea eliminar la Confirmación`,
      text: confirmacion.nombres,
      icon: "warning",
      confirmButtonText: "Confirmar",
      ...themeSwal,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const error = await onEliminarConfirmacion(confirmacion._id!);
        console.log({ error });

        handleSocket(error);
        if (error.error) return;
      }
    });
  }, []);
  return (
    <StyledTableRow
      key={confirmacion._id}
      crud={confirmacion.crud}
      onDoubleClick={() => {
        // setEditando(true);
      }}
    >
      <StyledTableCell padding="checkbox">
        <Box display="flex" alignItems="center" flexWrap="nowrap">
          <Acciones
            actions={[
              {
                color: "primary",
                disabled: false,
                Icon: Create,
                name: `Editar`,
                onClick: onClickEditar,
                tipo: "icono",
                size: "small",
              },

              {
                color: "warning",
                Icon: DeleteForever,
                name: `Eliminar`,
                onClick: () => {
                  handleEliminar();
                },
                tipo: "icono",
                size: "small",
              },
              ...actionsJoins,
            ]}
          />
          <Tooltip title="PDF" arrow>
            <IconButton
              aria-label="PDF"
              color="error"
              size="small"
              onClick={(event) => setAnchorElImpresion(event.currentTarget)}
            >
              <PictureAsPdf fontSize="small" />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorElImpresion}
            open={Boolean(anchorElImpresion)}
            onClose={() => setAnchorElImpresion(null)}
          >
            {OPCIONES_VER_PDF.map(({ modo, label }) => (
              <MenuItem key={modo} onClick={() => verPdf(modo)}>
                <ListItemIcon>
                  <Visibility fontSize="small" />
                </ListItemIcon>
                <ListItemText>{label}</ListItemText>
              </MenuItem>
            ))}
            <Divider />
            <MenuItem onClick={descargarPdf}>
              <ListItemIcon>
                <Download fontSize="small" />
              </ListItemIcon>
              <ListItemText>Descargar PDF completo</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </StyledTableCell>
      <>
        <StyledTableCell>
          {busqueda
            ? useResaltarTexto({
                busqueda: busqueda,
                texto: confirmacion.apellidos,
              })
            : confirmacion.apellidos}
        </StyledTableCell>
        <StyledTableCell>
          {busqueda
            ? useResaltarTexto({
                busqueda: busqueda,
                texto: confirmacion.nombres,
              })
            : confirmacion.nombres}
        </StyledTableCell>
        <StyledTableCell>
          {busqueda
            ? useResaltarTexto({
                busqueda: busqueda,
                texto: confirmacion.edad,
              })
            : confirmacion.edad}
        </StyledTableCell>
        <StyledTableCell>
          {busqueda
            ? useResaltarTexto({
                busqueda: busqueda,
                texto: confirmacion.parroquiaBustismo.name,
              })
            : confirmacion.parroquiaBustismo.name}
        </StyledTableCell>
        <StyledTableCell>
          {busqueda
            ? useResaltarTexto({
                busqueda: busqueda,
                texto: confirmacion.parroquiaConfirmacion.name,
              })
            : confirmacion.parroquiaConfirmacion.name}
        </StyledTableCell>
        <StyledTableCell>
          {busqueda
            ? useResaltarTexto({
                busqueda: busqueda,
                texto: getMinistroDisplayName(confirmacion.ministro),
              })
            : getMinistroDisplayName(confirmacion.ministro)}
        </StyledTableCell>
        <StyledTableCell>
          {busqueda
            ? useResaltarTexto({
                busqueda: busqueda,
                texto: confirmacion.padre,
              })
            : confirmacion.padre}
        </StyledTableCell>
        <StyledTableCell>
          {busqueda
            ? useResaltarTexto({
                busqueda: busqueda,
                texto: confirmacion.madre,
              })
            : confirmacion.madre}
        </StyledTableCell>
        <StyledTableCell>
          {busqueda
            ? useResaltarTexto({
                busqueda: busqueda,
                texto: confirmacion.padrino,
              })
            : confirmacion.padrino}
        </StyledTableCell>
        <StyledTableCell>
          {busqueda
            ? useResaltarTexto({
                busqueda: busqueda,
                texto: confirmacion.madrina,
              })
            : confirmacion.madrina}
        </StyledTableCell>
        <StyledTableCell>
          {busqueda
            ? useResaltarTexto({
                busqueda: busqueda,
                texto: confirmacion.fecha,
              })
            : formatearFechaSinHoras(confirmacion.fecha)}
        </StyledTableCell>
        <StyledTableCell>
          {confirmacion.observacion}
        </StyledTableCell>
      </>
    </StyledTableRow>
  );
};
