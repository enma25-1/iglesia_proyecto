import { Dispatch, useCallback } from "react";
import { StyledTableCell, StyledTableRow } from "../../../components/style";
import { useResaltarTexto, useThemeSwal } from "../../../hooks";
import { usePageStore } from "../../Page";
import { ParroquiaActions, ParroquiaItem } from "..";
import Swal from "sweetalert2";
import { Action } from "../../../../interfaces/global";
import { handleSocket } from "../../../../helpers";
import { Acciones } from "../../../components";
import { Create, DeleteForever } from "@mui/icons-material";
interface StaticParroquiaProps extends ParroquiaActions {
  parroquia: ParroquiaItem;
  busqueda: string;
  setEditando: Dispatch<React.SetStateAction<boolean>>;
  actionsJoins?: Action[];
}

export const StaticParroquia = ({
  parroquia,
  busqueda,
  setEditando,
  actionsJoins = [],
  onEliminarParroquia,
}: StaticParroquiaProps) => {
  const themeSwal = useThemeSwal();
  const { noTienePermiso } = usePageStore();
  const onClickEditar = () => {
    if (noTienePermiso("Parroquia", "update")) return;
    setEditando((prev) => !prev);
  };
  const handleEliminar = useCallback(() => {
    if (noTienePermiso("Parroquia", "delete")) return;
    Swal.fire({
      title: `Desea eliminar la parroquia`,
      text: parroquia.name,
      icon: "warning",
      confirmButtonText: "Confirmar",
      ...themeSwal,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const error = await onEliminarParroquia(parroquia._id!);
        console.log({ error });

        handleSocket(error);
        if (error.error) return;
      }
    });
  }, []);
  return (
    <StyledTableRow
      key={parroquia._id}
      crud={parroquia.crud}
      onDoubleClick={() => {
        setEditando(true);
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
              color: "error",
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
      </StyledTableCell>
      <>
        <StyledTableCell>
          {busqueda
            ? useResaltarTexto({
                busqueda: busqueda,
                texto: parroquia.depto.name,
              })
            : parroquia.depto.name}
        </StyledTableCell>
        <StyledTableCell>
          {busqueda
            ? useResaltarTexto({
                busqueda: busqueda,
                texto: parroquia.municipio.name,
              })
            : parroquia.municipio.name}
        </StyledTableCell>
        <StyledTableCell>
          {busqueda
            ? useResaltarTexto({
                busqueda: busqueda,
                texto: parroquia.distrito?.name ?? "",
              })
            : parroquia.distrito?.name}
        </StyledTableCell>
        <StyledTableCell>
          {busqueda
            ? useResaltarTexto({ busqueda: busqueda, texto: parroquia.name })
            : parroquia.name}
        </StyledTableCell>

        <StyledTableCell>
          {busqueda
            ? useResaltarTexto({
                busqueda: busqueda,
                texto: parroquia.direccion,
              })
            : parroquia.direccion}
        </StyledTableCell>
      </>
    </StyledTableRow>
  );
};
