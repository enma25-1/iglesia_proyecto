import { useCallback } from "react";
import { StyledTableCell, StyledTableRow } from "../../../components/style";
import { useResaltarTexto, useThemeSwal } from "../../../hooks";
import { usePageStore } from "../../Page";
import { ConfirmacionActions, ConfirmacionItem } from "..";
import Swal from "sweetalert2";
import { Action } from "../../../../interfaces/global";
import { formatearFechaSinHoras, handleSocket } from "../../../../helpers";
import { Acciones } from "../../../components";
import { getMinistroDisplayName } from "../../Ministro";
import {
  Create,
  DeleteForever,
  Download,
  PictureAsPdf,
} from "@mui/icons-material";
import { clienteAxios } from "../../../../api";
import { saveAs } from "file-saver";
interface StaticConfirmacionProps extends ConfirmacionActions {
  confirmacion: ConfirmacionItem;
  busqueda: string;
  actionsJoins?: Action[];
  handleEditar: (itemEditing: ConfirmacionItem) => void;
}

export const StaticConfirmacion = ({
  confirmacion,
  busqueda,
  actionsJoins = [],
  onEliminarConfirmacion,
  handleEditar,
}: StaticConfirmacionProps) => {
  const themeSwal = useThemeSwal();
  const { noTienePermiso } = usePageStore();
  const onClickEditar = () => {
    handleEditar(confirmacion);
  };
  const handleEliminar = useCallback(() => {
    if (noTienePermiso("Confirmacion", "delete")) return;
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
            {
              color: "success",
              Icon: Download,
              name: `PDF`,
              onClick: async () => {
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
                    `Confirmacion: ${confirmacion.ministro} - ${confirmacion.nombres} ${confirmacion.apellidos}.pdf`,
                  );
                } catch (error: any) {
                  // const msg =
                  //   error?.response?.data?.msg ||
                  //   "Error al consultar los detalles de ventas";
                }
              },
              tipo: "icono",
              size: "small",
            },
            {
              color: "error",
              Icon: PictureAsPdf,
              name: `Ver PDF`,
              onClick: async () => {
                try {
                  window.open(
                    `${clienteAxios.defaults.baseURL}/reporte/pdf?ID=${confirmacion._id}`,
                    "_blank",
                  );
                } catch (error: any) {}
              },
              tipo: "icono",
              size: "small",
            },
            ...actionsJoins,
          ]}
        />
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
