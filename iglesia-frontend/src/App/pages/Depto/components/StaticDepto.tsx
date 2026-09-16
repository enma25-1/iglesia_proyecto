import { Dispatch, useCallback } from "react";
import { StyledTableCell, StyledTableRow } from "../../../components/style";
import { useResaltarTexto, useThemeSwal } from "../../../hooks";
import { usePageStore } from "../../Page";
import { DeptoItem, SocketEmitDepto } from "..";
import Swal from "sweetalert2";
import { useProvideSocket } from "../../../../hooks";

import { Action, ErrorSocket } from "../../../../interfaces/global";
import { handleSocket } from "../../../../helpers";
import { Acciones } from "../../../components";
import { Create, DeleteForever } from "@mui/icons-material";

export const StaticDepto = ({
  depto,
  busqueda,
  setEditando,
  actionsJoins = [],
}: {
  depto: DeptoItem;
  busqueda: string;
  setEditando: Dispatch<React.SetStateAction<boolean>>;
  actionsJoins: Action[];
}) => {
  const themeSwal = useThemeSwal();
  const { noTienePermiso } = usePageStore();
  const { socket } = useProvideSocket();
  const onClickEditar = () => {
    if (noTienePermiso("Depto", "update")) return;
    setEditando((prev) => !prev);
  };
  const handleEliminar = useCallback(() => {
    if (noTienePermiso("Depto", "delete")) return;
    Swal.fire({
      title: `Desea eliminar el Depto`,
      text: depto.name,
      icon: "warning",
      confirmButtonText: "Confirmar",
      ...themeSwal,
    }).then((result) => {
      if (result.isConfirmed) {
        socket?.emit(
          SocketEmitDepto.eliminar,
          { _id: depto._id },
          ({ error, msg }: ErrorSocket) => {
            handleSocket({ error, msg });
            if (error) return;
          }
        );
      }
    });
  }, []);
  return (
    <StyledTableRow
      key={depto._id}
      crud={depto.crud}
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
      <StyledTableCell>
        {busqueda
          ? useResaltarTexto({ busqueda: busqueda, texto: depto.name })
          : depto.name}
      </StyledTableCell>
      <StyledTableCell>{depto.totalMunicipios}</StyledTableCell>
    </StyledTableRow>
  );
};
