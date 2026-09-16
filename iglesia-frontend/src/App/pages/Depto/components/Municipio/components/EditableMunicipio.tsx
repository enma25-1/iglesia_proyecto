import { Acciones } from "../../../../../components";
import {
  StyledTableCell,
  StyledTableRow,
} from "../../../../../components/style";
import { CancelOutlined, Check } from "@mui/icons-material";
import { Dispatch, KeyboardEvent, useMemo } from "react";
import { ErrorSocket } from "../../../../../../interfaces/global";
import { handleSocket, required } from "../../../../../../helpers";
import { MunicipioItem } from "../interfaces";
import { SocketEmitMunicipio } from "../helpers";
import { TextField } from "@mui/material";
import { useForm, useProvideSocket } from "../../../../../../hooks";

import { usePageStore } from "../../../../Page";

export const EditableMunicipio = ({
  municipio,
  depto,
  setAgregando,
  setEditando,
  actionsJoins = [],
}: {
  municipio: MunicipioItem;
  depto: string;
  setAgregando?: Dispatch<React.SetStateAction<boolean>>;
  setEditando: Dispatch<React.SetStateAction<boolean>>;
  actionsJoins?: any[];
}) => {
  const { noTienePermiso } = usePageStore();
  const { socket } = useProvideSocket();
  const esNuevo = useMemo(() => !Boolean(municipio._id), []);
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
  } = useForm(municipio, config);

  const onClickEditar = () => {
    if (noTienePermiso("Depto", "update")) return;
    if (esNuevo) {
      return setAgregando!(false);
    }
    setEditando(false);
  };

  const handleGuardar = () => {
    socket?.emit(
      SocketEmitMunicipio.agregar,
      { ...formValues, depto },
      ({ error, msg }: ErrorSocket) => {
        handleSocket({ error, msg });
        setCargandoSubmit(false);
        if (error) return;
        onNewForm(municipio);
      }
    );
  };
  const handleEditar = () => {
    socket?.emit(
      SocketEmitMunicipio.editar,
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
    <StyledTableRow key={municipio._id} crud={municipio.crud}>
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
    </StyledTableRow>
  );
};
