import { Dispatch, useCallback } from "react";
import { StyledTableCell, StyledTableRow } from "../../../components/style";
import { useResaltarTexto, useThemeSwal } from "../../../hooks";
import { usePageStore } from "../../Page";
import { MinistroActions, MinistroItem } from "..";
import Swal from "sweetalert2";
import { Action } from "../../../../interfaces/global";
import { handleSocket } from "../../../../helpers";
import { Acciones } from "../../../components";
import { Check, Create, DeleteForever } from "@mui/icons-material";
interface StaticMinistroProps extends MinistroActions {
  ministro: MinistroItem;
  busqueda: string;
  setEditando: Dispatch<React.SetStateAction<boolean>>;
  actionsJoins?: Action[];
}

export const StaticMinistro = ({
  ministro,
  busqueda,
  setEditando,
  actionsJoins = [],
  onEliminarMinistro,
}: StaticMinistroProps) => {
  const themeSwal = useThemeSwal();
  const { noTienePermiso } = usePageStore();
  const onClickEditar = () => {
    if (noTienePermiso("Ministro", "update")) return;
    setEditando((prev) => !prev);
  };
  const handleEliminar = useCallback(() => {
    if (noTienePermiso("Ministro", "delete")) return;
    Swal.fire({
      title: `Desea eliminar el Ministro`,
      text: ministro.name,
      icon: "warning",
      confirmButtonText: "Confirmar",
      ...themeSwal,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const error = await onEliminarMinistro(ministro._id!);
        console.log({ error });

        handleSocket(error);
        if (error.error) return;
      }
    });
  }, []);
  return (
    <StyledTableRow
      key={ministro._id}
      crud={ministro.crud}
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
            {
              color: "success",
              disabled: false,
              Icon: Check,
              name: `Estado`,
              active: ministro.estado,
              onClick: () => {},
              tipo: "checkbox",
              size: "small",
            },
            ...actionsJoins,
          ]}
        />
      </StyledTableCell>
      <>
        <StyledTableCell>
          {ministro.orden?.abreviatura || ""}
        </StyledTableCell>
        <StyledTableCell>
          {busqueda
            ? useResaltarTexto({ busqueda: busqueda, texto: ministro.name })
            : ministro.name}
        </StyledTableCell>{" "}
        <StyledTableCell>
          {busqueda
            ? useResaltarTexto({
                busqueda: busqueda,
                texto: ministro.depto?.name,
              })
            : ministro.depto?.name}
        </StyledTableCell>
        <StyledTableCell>
          {busqueda
            ? useResaltarTexto({
                busqueda: busqueda,
                texto: ministro.municipio?.name,
              })
            : ministro.municipio?.name}
        </StyledTableCell>
        <StyledTableCell>
          {busqueda
            ? useResaltarTexto({
                busqueda: busqueda,
                texto: ministro.distrito?.name ?? "",
              })
            : ministro.distrito?.name}
        </StyledTableCell>
      </>
    </StyledTableRow>
  );
};
