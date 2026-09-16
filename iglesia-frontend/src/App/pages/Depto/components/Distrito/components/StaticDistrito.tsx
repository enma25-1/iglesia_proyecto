import { Dispatch, useCallback } from "react";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../../../../components/style";
import { useResaltarTexto, useThemeSwal } from "../../../../../hooks";
import { usePageStore } from "../../../../Page";
import { DistritoItem } from "../interfaces";
import Swal from "sweetalert2";
import { useProvideSocket } from "../../../../../../hooks";
import { SocketEmitDistrito } from "../helpers";
import { ErrorSocket } from "../../../../../../interfaces/global";
import { handleSocket } from "../../../../../../helpers";
import { Acciones } from "../../../../../components";
import { Create, DeleteForever } from "@mui/icons-material";

export const StaticDistrito = ({
  distrito,
  busqueda,
  setEditando,
  depto,
  actionsJoins = [],
}: {
  distrito: DistritoItem;
  busqueda: string;
  setEditando: Dispatch<React.SetStateAction<boolean>>;
  depto: string;
  actionsJoins?: any[];
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
      title: `Desea eliminar el Distrito`,
      text: distrito.name,
      icon: "warning",
      confirmButtonText: "Confirmar",
      ...themeSwal,
    }).then((result) => {
      if (result.isConfirmed) {
        socket?.emit(
          SocketEmitDistrito.eliminar,
          { _id: distrito._id, depto },
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
      key={distrito._id}
      crud={distrito.crud}
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
          ? useResaltarTexto({ busqueda: busqueda, texto: distrito.name })
          : distrito.name}
      </StyledTableCell>
      <StyledTableCell>{distrito.municipioNombre || ""}</StyledTableCell>
    </StyledTableRow>
  );
};
