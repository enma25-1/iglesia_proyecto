import { Acciones } from "../../../components";
import { StyledTableCell, StyledTableRow } from "../../../components/style";
import { DeptoItem } from "..";
import { SocketEmitDepto } from "../helpers";

import { useForm, useProvideSocket } from "../../../../hooks";
import { Dispatch, KeyboardEvent, useMemo } from "react";
import { handleSocket, required } from "../../../../helpers";
import { Action, ErrorSocket } from "../../../../interfaces/global";
import { CancelOutlined, Check } from "@mui/icons-material";
import { TextField } from "@mui/material";

import { usePageStore } from "../../Page";

export const EditableDepto = ({
  depto,
  setAgregando,
  setEditando,
  esNuevo,
  actionsJoins = [],
}: {
  actionsJoins?: Action[];
  depto: DeptoItem;
  esNuevo?: boolean;
  setAgregando?: Dispatch<React.SetStateAction<boolean>>;
  setEditando: Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { noTienePermiso } = usePageStore();
  const { socket } = useProvideSocket();
  const config = useMemo(
    () => ({
      name: [required],
    }),
    []
  );

  const {
    formValues,
    handleChange,
    errorValues,
    handleBlur,
    isFormInvalidSubmit,
    setisSubmited,
    cargandoSubmit,
    setCargandoSubmit,
    onNewForm,
  } = useForm(depto, config);

  const onClickEditar = () => {
    if (noTienePermiso("Depto", "update")) return;
    if (esNuevo) {
      return setAgregando!(false);
    }
    setEditando(false);
  };

  const handleGuardar = () => {
    socket?.emit(
      SocketEmitDepto.agregar,
      { ...formValues },
      ({ error, msg }: ErrorSocket) => {
        handleSocket({ error, msg });
        setCargandoSubmit(false);
        if (error) return;
        onNewForm(depto);
        // setSAgregando(false);
      }
    );
  };
  const handleEditar = () => {
    socket?.emit(
      SocketEmitDepto.editar,
      formValues,
      ({ error, msg }: ErrorSocket) => {
        handleSocket({ error, msg });
        setCargandoSubmit(false);
        if (error) return;
        setEditando(false);
      }
    );
  };
  const onSubmit = () => {
    setisSubmited(true);
    if (isFormInvalidSubmit(formValues)) {
      return;
    }
    setCargandoSubmit(true);
    if (esNuevo) {
      handleGuardar();
    } else {
      handleEditar();
    }
  };

  const defaultProps = {
    fullWidth: true,
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        onSubmit();
      }
      if (e.key === "Escape") {
        onClickEditar();
      }
    },
    autoComplete: "false",
  };
  return (
    <StyledTableRow key={depto._id} crud={depto.crud}>
      <StyledTableCell padding="checkbox">
        <Acciones
          actions={[
            {
              color: "error",
              disabled: cargandoSubmit,
              Icon: CancelOutlined,
              name: `Editar`,
              onClick: onClickEditar,
              tipo: "icono",
              size: "small",
            },
            {
              color: "success",
              disabled: cargandoSubmit,
              Icon: Check,
              name: `Guardar cambios`,
              onClick: () => {
                onSubmit();
              },
              tipo: "icono",
              size: "small",
            },
            ...actionsJoins,
          ]}
        />
      </StyledTableCell>
      <StyledTableCell>
        <TextField
          {...defaultProps}
          autoFocus
          value={formValues.name}
          onChange={handleChange}
          name="name"
          error={errorValues.name.length > 0}
          onBlur={handleBlur}
          helperText={errorValues.name.join(" - ")}
        />
      </StyledTableCell>
      <StyledTableCell>0</StyledTableCell>
    </StyledTableRow>
  );
};
