import {
  StyledContainerForm,
  StyledGridContainer,
  StyledModalBoxFooter,
  StyledTypographyFooter,
  StyledTypographyFooterSpan,
} from "../../../components/style";
import {
  Autocomplete,
  Box,
  Divider,
  IconButton,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import { Cancel, Save } from "@mui/icons-material";
import { ModalLayout } from "../../../components";
import {
  formatearFecha,
  handleSocket,
  required,
  min,
} from "../../../../helpers";
import { handleNavigation, useFieldProps } from "../../../hooks/useFieldProps";
import { useForm } from "../../../../hooks";
import { useHttp, useModalConfig } from "../../../hooks";
import { useEffect, useMemo } from "react";
import { ModalHeader } from "../../../components/Modal/ModalHeader";
import { useConfirmacionStore } from "../hooks/useConfirmacionStore";
import { ParroquiaForeign } from "../../Parroquia";
import { MinistroForeign, getMinistroDisplayName } from "../../Ministro";
import Swal from "sweetalert2";
import { useThemeSwal } from "../../../hooks";
import { clienteAxios } from "../../../../api";

export const ModalConfirmacion = () => {
  const themeSwal = useThemeSwal();
  // Hooks
  const {
    itemActive,
    itemDefault,
    openModal,
    // setItemActive,
    setOpenModal,
    onAgregarConfirmacion,
    onEditConfirmacion,
  } = useConfirmacionStore();
  const { idModal, columns, vhContainer, width } =
    useModalConfig("modalProducto");

  const editar = useMemo(() => itemActive._id, [itemActive]);

  // Configuración de validación
  const config = useMemo(
    () => ({
      apellidos: [required],
      nombres: [required],
      edad: [required],
      "parroquiaBustismo.name": [required],
      "parroquiaConfirmacion.name": [required],
      "ministro.name": [required],
      "ministroConfirma.name": [required],
      padre: [
        (value: string, allValues: any) =>
          !value && !allValues.madre
            ? "Al menos el padre o la madre es requerido"
            : "",
      ],
      madre: [
        (value: string, allValues: any) =>
          !value && !allValues.padre
            ? "Al menos el padre o la madre es requerido"
            : "",
      ],
      padrino: [
        (value: string, allValues: any) =>
          !value && !allValues.madrina
            ? "Al menos el padrino o la madrina es requerido"
            : "",
      ],
      madrina: [
        (value: string, allValues: any) =>
          !value && !allValues.padrino
            ? "Al menos el padrino o la madrina es requerido"
            : "",
      ],
      fecha: [required],
      libro: [(e: number) => min(e, 1)],
      folio: [(e: number) => min(e, 1)],
      observacion: [],
      // photos: [
      //   (e: string[]) => {
      //     return e.length === 0 ? "Al menos una imagen requerida" : "";
      //   },
      // ],
      // name: [required],
      // price: [(value: number) => min(value, 1)],
      // "categoria.name": [required],
      // "marca.name": [required],
      // tipoProducto: [required],
      // description: [],
      // estado: [],
      // rUsuario: [],
      // eUsuario: [],
      // createdAt: [],
      // updatedAt: [],
    }),
    [editar],
  );

  // Formulario
  const {
    formValues,
    errorValues,
    handleChange,
    setisSubmited,
    isFormInvalid,
    handleBlur,
    isFormInvalidSubmit,
    onNewForm,
    setformValues,
    setCargandoSubmit,
    cargandoSubmit,
  } = useForm(itemDefault, config);
  const { defaultPropsGenerator, refs } = useFieldProps({
    config,
    errorValues,
    formValues,
    handleBlur,
    handleChange,
    handleKeyDown: (e) => {
      handleNavigation(e, config, refs);
    },
  });
  const { data: parroquiasData } = useHttp<ParroquiaForeign[], {}>({
    initialBody: {}, // Puedes omitir esta línea si no necesitas un cuerpo de solicitud
    initialData: [],
    initialMethod: "get",
    initialUrl: "/parroquia/getAllF",
    fetchOnMount: true,
  });
  const { data: ministrosData } = useHttp<MinistroForeign[], {}>({
    initialBody: {}, // Puedes omitir esta línea si no necesitas un cuerpo de solicitud
    initialData: [],
    initialMethod: "get",
    initialUrl: "/ministro/getAllF",
    fetchOnMount: true,
  });

  useEffect(() => {
    setformValues((prev) => ({
      ...prev,
      ministro: ministrosData.find((item) => item.estado) ?? prev.ministro,
    }));
  }, [ministrosData, openModal]);

  //Autocompletes
  //Marca
  // const {
  //   data: dataMarca,
  //   loading: loadingMarca,
  //   refetchWithNewBody: RFWNBMarca,
  // } = useHttp<ProductoItem["marca"][], { search: string }>({
  //   initialUrl: "/marca/search",
  //   initialMethod: "post",
  //   initialBody: {
  //     search: "",
  //   },
  //   initialData: [],
  // });
  // const dSearchMarca = useDebouncedCallback(RFWNBMarca);

  // Carga de archivos
  // type ItemKeys = keyof ProductoItem;
  // const [images, setImages] = useState<{
  //   [K in ItemKeys]?: PhotoDataMultiple;
  // }>({});
  // Funciones de manejo
  const checkDuplicate = async (): Promise<boolean> => {
    try {
      const { data } = await clienteAxios.post("/confirmacion/checkDuplicate", {
        nombres: formValues.nombres,
        apellidos: formValues.apellidos,
        padre: formValues.padre,
        madre: formValues.madre,
        padrino: formValues.padrino,
        madrina: formValues.madrina,
        _id: formValues._id,
      });
      if (data.hasDuplicate) {
        const result = await Swal.fire({
          title: "Posible duplicado",
          text: `Ya existe un registro con el nombre "${formValues.nombres} ${formValues.apellidos}" con un padre/madre y padrino/madrina similar. ¿Desea continuar?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, continuar",
          cancelButtonText: "Cancelar",
          ...themeSwal,
        });
        return result.isConfirmed;
      }
      return true;
    } catch {
      return true;
    }
  };

  const handleGuardar = async () => {
    const canContinue = await checkDuplicate();
    if (!canContinue) {
      setCargandoSubmit(false);
      return;
    }
    const error = await onAgregarConfirmacion(formValues);
    console.log({ error });

    setCargandoSubmit(false);
    handleSocket(error);
    if (error.error) return;
    onNewForm({
      ...itemDefault,
      parroquiaConfirmacion: formValues.parroquiaConfirmacion,
      ministro: formValues.ministro,
      ministroConfirma: formValues.ministroConfirma,
      fecha: formValues.fecha,
      libro: formValues.libro,
      folio: formValues.folio,
    });
  };
  const handleEditar = async () => {
    const canContinue = await checkDuplicate();
    if (!canContinue) {
      setCargandoSubmit(false);
      return;
    }
    const error = await onEditConfirmacion(formValues);
    console.log({ error });

    setCargandoSubmit(false);
    handleSocket(error);
    if (error.error) return;
    onNewForm(itemDefault);
    setOpenModal(false);
  };

  const onHandleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setisSubmited(true);
    if (cargandoSubmit) return;
    setCargandoSubmit(true);

    if (isFormInvalidSubmit({ ...formValues })) {
      setCargandoSubmit(false);
      return;
    }
    if (editar) handleEditar();
    else handleGuardar();
  };

  // Efectos secundarios
  useEffect(() => {
    onNewForm({ ...itemActive });
    // setImages({
    //   photos: {
    //     antiguos: itemActive.photos,
    //     eliminados: [],
    //     newFiles: [],
    //   },
    // });
  }, [itemActive]);

  return (
    <>
      <ModalLayout
        idModal={idModal}
        open={openModal}
        setOpen={() => {
          setOpenModal(false);
        }}
        vh={vhContainer.height}
        width={width}
      >
        <>
          <ModalHeader
            idModal={idModal}
            AccionesLeft={[]}
            // color={isFormInvalid ? "error" : "primary"}
            texto={editar ? "editando" : "creando"}
            AccionesRight={[
              {
                color: "error",
                name: "Cerrar",
                onClick() {
                  setOpenModal(false);
                },
                tipo: "icono",
                Icon: Cancel,
              },
            ]}
          />
          <form onSubmit={onHandleSubmit}>
            <StyledContainerForm {...vhContainer}>
              <StyledGridContainer {...columns}>
                <Divider className="fullWidth">
                  <Typography variant="subtitle1" color={"secondary"}>
                    Principal
                  </Typography>
                </Divider>
                <Autocomplete
                  options={parroquiasData}
                  disableClearable={false}
                  value={formValues.parroquiaConfirmacion}
                  getOptionLabel={(value) =>
                    value.name + " -- " + value.direccion
                  }
                  isOptionEqualToValue={(option, value) =>
                    option._id === value._id
                  }
                  onChange={(_, newValue) => {
                    if (!newValue) return;
                    setformValues({
                      ...formValues,
                      parroquiaConfirmacion: newValue,
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Parroquia Confirmación"
                      {...defaultPropsGenerator(
                        "parroquiaConfirmacion.name",
                        true,
                        false,
                      )}
                      // onChange={({ target }) => {
                      //   dSearchCategoria({ search: target.value });
                      // }}
                      InputProps={{
                        ...params.InputProps,
                        sx: { paddingRight: "0px !important" },
                        // endAdornment: (
                        //   <InputAdornment position="end">
                        //     <Tooltip title={`agregar ${"path"}`}>
                        //       <IconButton
                        //         aria-label=""
                        //         onClick={() => {
                        //           // navigate(path);
                        //         }}
                        //       ></IconButton>
                        //     </Tooltip>
                        //   </InputAdornment>
                        // ),
                      }}
                    />
                  )}
                />
                <TextField
                  label={"Fecha"}
                  InputLabelProps={{ shrink: true }}
                  type="date"
                  {...defaultPropsGenerator("fecha", true, true)}
                  value={formValues.fecha.substring(0, 10)}
                />
                <Autocomplete
                  options={ministrosData}
                  disableClearable={false}
                  value={formValues.ministro}
                  getOptionLabel={(value) => getMinistroDisplayName(value)}
                  isOptionEqualToValue={(option, value) =>
                    option._id === value._id
                  }
                  onChange={(_, newValue) => {
                    if (!newValue) return;
                    setformValues({
                      ...formValues,
                      ministro: newValue,
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Ministro"
                      {...defaultPropsGenerator("ministro.name", true, false)}
                      // onChange={({ target }) => {
                      //   dSearchCategoria({ search: target.value });
                      // }}
                      InputProps={{
                        ...params.InputProps,
                        sx: { paddingRight: "0px !important" },
                        // endAdornment: (
                        //   <InputAdornment position="end">
                        //     <Tooltip title={`agregar ${"path"}`}>
                        //       <IconButton
                        //         aria-label=""
                        //         onClick={() => {
                        //           // navigate(path);
                        //         }}
                        //       ></IconButton>
                        //     </Tooltip>
                        //   </InputAdornment>
                        // ),
                      }}
                    />
                  )}
                />
                <Autocomplete
                  options={ministrosData}
                  disableClearable={false}
                  value={formValues.ministroConfirma}
                  getOptionLabel={(value) => getMinistroDisplayName(value)}
                  isOptionEqualToValue={(option, value) =>
                    option._id === value._id
                  }
                  onChange={(_, newValue) => {
                    if (!newValue) return;
                    setformValues({
                      ...formValues,
                      ministroConfirma: newValue,
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Ministro de confirmación"
                      {...defaultPropsGenerator(
                        "ministroConfirma.name",
                        true,
                        false,
                      )}
                      // onChange={({ target }) => {
                      //   dSearchCategoria({ search: target.value });
                      // }}
                      InputProps={{
                        ...params.InputProps,
                        sx: { paddingRight: "0px !important" },
                        // endAdornment: (
                        //   <InputAdornment position="end">
                        //     <Tooltip title={`agregar ${"path"}`}>
                        //       <IconButton
                        //         aria-label=""
                        //         onClick={() => {
                        //           // navigate(path);
                        //         }}
                        //       ></IconButton>
                        //     </Tooltip>
                        //   </InputAdornment>
                        // ),
                      }}
                    />
                  )}
                />
                <TextField
                  type="number"
                  label={"Libro"}
                  {...defaultPropsGenerator("libro", true, true)}
                />
                <TextField
                  type="number"
                  label={"Folio"}
                  {...defaultPropsGenerator("folio", true, true)}
                />
                <Divider className="fullWidth">
                  <Typography variant="subtitle1" color={"secondary"}>
                    Secundario
                  </Typography>
                </Divider>
                <TextField
                  autoFocus
                  label={"Nombre"}
                  {...defaultPropsGenerator("nombres", true, true)}
                />
                <TextField
                  label={"Apellidos"}
                  {...defaultPropsGenerator("apellidos", true, true)}
                />
                <TextField
                  label={"Edad"}
                  type="number"
                  {...defaultPropsGenerator("edad", true, true)}
                />
                <TextField
                  label={"Padre"}
                  {...defaultPropsGenerator("padre", true, true)}
                />
                <TextField
                  label={"Madre"}
                  {...defaultPropsGenerator("madre", true, true)}
                />
                <TextField
                  label={"Padrino"}
                  {...defaultPropsGenerator("padrino", true, true)}
                />
                <TextField
                  label={"Madrina"}
                  {...defaultPropsGenerator("madrina", true, true)}
                />
                <Autocomplete
                  options={parroquiasData}
                  disableClearable={false}
                  value={formValues.parroquiaBustismo}
                  getOptionLabel={(value) => value.name}
                  isOptionEqualToValue={(option, value) =>
                    option._id === value._id
                  }
                  onChange={(_, newValue) => {
                    if (!newValue) return;
                    setformValues({
                      ...formValues,
                      parroquiaBustismo: newValue,
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Parroquia Bautismo"
                      {...defaultPropsGenerator(
                        "parroquiaBustismo.name",
                        true,
                        false,
                      )}
                      // onChange={({ target }) => {
                      //   dSearchCategoria({ search: target.value });
                      // }}
                      InputProps={{
                        ...params.InputProps,
                        sx: { paddingRight: "0px !important" },
                        // endAdornment: (
                        //   <InputAdornment position="end">
                        //     <Tooltip title={`agregar ${"path"}`}>
                        //       <IconButton
                        //         aria-label=""
                        //         onClick={() => {
                        //           // navigate(path);
                        //         }}
                        //       ></IconButton>
                        //     </Tooltip>
                        //   </InputAdornment>
                        // ),
                      }}
                    />
                  )}
                />
                <TextField
                  label={"Observación"}
                  multiline
                  rows={2}
                  className="fullWidth"
                  {...defaultPropsGenerator("observacion", true, true)}
                />
                {/* <TextField
                  type="number"
                  className="fullWidth"
                  label={"Tipo Producto"}
                  {...defaultPropsGenerator("tipoProducto", true, true)}
                  select
                >
                  {tiposProducto.map((tipoProducto) => (
                    <MenuItem key={tipoProducto} value={tipoProducto}>
                      {tipoProducto}
                    </MenuItem>
                  ))}
                </TextField>
              */}
              </StyledGridContainer>
            </StyledContainerForm>
            {cargandoSubmit && (
              <LinearProgress color="primary" variant="query" />
            )}
            <StyledModalBoxFooter>
              <Box display={"flex"} alignItems={"center"} gap={1}>
                <StyledTypographyFooter
                  color={isFormInvalid ? "error" : "secondary.light"}
                >
                  C:
                  <Typography className="span" component={"span"}>
                    {formatearFecha(formValues.createdAt)}
                  </Typography>
                </StyledTypographyFooter>
                <StyledTypographyFooter
                  color={isFormInvalid ? "error" : "secondary.light"}
                >
                  E:
                  <Typography className="span" component={"span"}>
                    {formatearFecha(formValues.updatedAt)}
                  </Typography>
                </StyledTypographyFooter>
              </Box>
              <Box display={"flex"} alignItems={"center"}>
                <StyledTypographyFooterSpan
                  color={isFormInvalid ? "error" : "primary.light"}
                >
                  GUARDAR:
                </StyledTypographyFooterSpan>
                <IconButton
                  aria-label="Submit"
                  type="submit"
                  disabled={cargandoSubmit}
                >
                  <Save />
                </IconButton>
              </Box>
            </StyledModalBoxFooter>
          </form>

          {/* </Box> */}
        </>
      </ModalLayout>
    </>
  );
};
