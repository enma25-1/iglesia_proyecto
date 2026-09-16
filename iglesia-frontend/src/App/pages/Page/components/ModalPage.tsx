import {
  StyledContainerForm,
  StyledGridContainer,
  StyledModalBoxFooter,
  StyledModalBoxHeader,
  StyledTypographyFooter,
  StyledTypographyFooterSpan,
  StyledTypographyHeader,
} from "../../../components/style";
import {
  Autocomplete,
  Box,
  IconButton,
  InputAdornment,
  LinearProgress,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Cancel, Save } from "@mui/icons-material";
import { ModalLayout } from "../../../components";
import {
  ConvertirIcono,
  formatearFecha,
  formatUsuarioForeign,
  handleSocket,
  required,
  roles,
} from "../../../../helpers";
import { ErrorSocket } from "../../../../interfaces/global";
import { handleNavigation, useFieldProps } from "../../../hooks/useFieldProps";
import { PageItem } from "../interfaces";
import { IconosFiltered, SocketEmitPage } from "../helpers";
import { useAuthStore, useForm, useProvideSocket } from "../../../../hooks";
import { useModalConfig } from "../../../hooks";
import { useEffect, useMemo } from "react";
import { usePageStore } from "../hooks/usePageStore";

export const ModalPage = () => {
  // Hooks
  const {
    itemActive,
    itemDefault,
    openModal,
    setItemActive,
    setOpenModal,
    data,
  } = usePageStore();
  const { columns, idModal, vhContainer, width } = useModalConfig("modalPage");
  const { usuario } = useAuthStore();
  const { socket } = useProvideSocket();

  const editar = useMemo(() => itemActive._id, [itemActive]);

  // Configuración de validación
  const config = useMemo(
    () => ({
      tipo: [],
      nombre: [required],
      padre: [],
      icono: [required],
      insert: itemActive.tipo === "ITEM" ? [required] : [],
      delete: itemActive.tipo === "ITEM" ? [required] : [],
      update: itemActive.tipo === "ITEM" ? [required] : [],
      select: [],
      ver: [required],
      orden: [required],
    }),
    [itemActive.tipo],
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

  // Funciones de manejo
  const handleGuardar = async () => {
    const formAllData: PageItem = {
      ...formValues,
      rUsuario: formatUsuarioForeign(usuario),
    };

    socket?.emit(
      SocketEmitPage.agregar,
      formAllData,
      ({ error, msg }: ErrorSocket) => {
        handleSocket({ error, msg });
        setCargandoSubmit(false);
        if (error) return;
        setOpenModal(false);
        setCargandoSubmit(false);
        setItemActive(itemDefault, true);
      },
    );
  };
  const handleEditar = async () => {
    const formAllData: PageItem = {
      ...formValues,
      eUsuario: formatUsuarioForeign(usuario),
    };
    socket?.emit(
      SocketEmitPage.editar,
      formAllData,
      ({ error, msg }: ErrorSocket) => {
        handleSocket({ error, msg });
        setCargandoSubmit(false);
        if (error) return;
        setOpenModal(false);
        setCargandoSubmit(false);
        setItemActive(itemDefault, true);
      },
    );
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
          <StyledModalBoxHeader>
            <Box display={"flex"} alignItems={"center"}>
              <StyledTypographyHeader
                color={isFormInvalid ? "error" : "primary"}
                id={idModal}
              >
                {editar ? "editando" : "creando"}{" "}
              </StyledTypographyHeader>
            </Box>
            <Tooltip title="Cancelar">
              <IconButton
                aria-label="Cancelar"
                onClick={() => {
                  setOpenModal(false);
                  // setImage(null);
                }}
                color="error"
              >
                <Cancel />
              </IconButton>
            </Tooltip>
          </StyledModalBoxHeader>
          <form onSubmit={onHandleSubmit}>
            <StyledContainerForm {...vhContainer}>
              <StyledGridContainer {...columns}>
                <TextField
                  disabled
                  label={"Tipo"}
                  {...defaultPropsGenerator("tipo", true, true)}
                />
                <TextField
                  label={"Pertenece a"}
                  {...defaultPropsGenerator("padre", true, true)}
                  select
                  InputLabelProps={{ shrink: true }}
                  SelectProps={{ displayEmpty: true }}
                >
                  <MenuItem value={""}>--</MenuItem>
                  {data
                    .filter((page) => page.tipo === "SECCION")
                    .map((page) => (
                      <MenuItem key={page._id} value={page._id}>
                        {page.nombre}
                      </MenuItem>
                    ))}
                </TextField>
                <TextField
                  label={"Nombre"}
                  {...defaultPropsGenerator("nombre", true, true)}
                />

                <Autocomplete
                  options={IconosFiltered}
                  getOptionLabel={(nombreIcono) =>
                    nombreIcono.replace("Rounded", "")
                  }
                  value={formValues.icono === "" ? null : formValues.icono}
                  onChange={(_, newValue) => {
                    if (!newValue) return;

                    setformValues((prev) => ({ ...prev, icono: newValue }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={"Icono"}
                      {...defaultPropsGenerator("icono", true, false)}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <InputAdornment position="end">
                            <Tooltip title="Ver iconos">
                              <IconButton
                                aria-label=""
                                onClick={() => {
                                  window.open("https://fonts.google.com/icons");
                                }}
                              >
                                {ConvertirIcono(formValues.icono)}
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
                {formValues.tipo === "ITEM" && (
                  <>
                    {" "}
                    <TextField
                      label={"Insert"}
                      {...defaultPropsGenerator("insert", true, true)}
                      select
                      SelectProps={{ multiple: true }}
                    >
                      {roles.map((rol) => (
                        <MenuItem
                          key={rol}
                          value={rol}
                          sx={{
                            fontWeight: formValues.insert.includes(rol)
                              ? "bold"
                              : "",
                          }}
                        >
                          {rol}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      label={"Delete"}
                      {...defaultPropsGenerator("delete", true, true)}
                      select
                      SelectProps={{ multiple: true }}
                    >
                      {roles.map((rol) => (
                        <MenuItem
                          key={rol}
                          value={rol}
                          sx={{
                            fontWeight: formValues.delete.includes(rol)
                              ? "bold"
                              : "",
                          }}
                        >
                          {rol}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      label={"Update"}
                      {...defaultPropsGenerator("update", true, true)}
                      select
                      SelectProps={{ multiple: true }}
                    >
                      {roles.map((rol) => (
                        <MenuItem
                          key={rol}
                          value={rol}
                          sx={{
                            fontWeight: formValues.update.includes(rol)
                              ? "bold"
                              : "",
                          }}
                        >
                          {rol}
                        </MenuItem>
                      ))}
                    </TextField>
                    {/* <TextField
                      label={"Select"}
                      {...defaultPropsGenerator("select", true, true)}
                      select
                      SelectProps={{ multiple: true }}
                    >
                      {roles.map((rol) => (
                        <MenuItem
                          key={rol}
                          value={rol}
                          sx={{
                            fontWeight: formValues.select.includes(rol)
                              ? "bold"
                              : "",
                          }}
                        >
                          {rol}
                        </MenuItem>
                      ))}
                    </TextField> */}
                  </>
                )}
                <TextField
                  label={"Ver"}
                  {...defaultPropsGenerator("ver", true, true)}
                  select
                  SelectProps={{ multiple: true }}
                >
                  {roles.map((rol) => (
                    <MenuItem
                      key={rol}
                      value={rol}
                      sx={{
                        fontWeight: formValues.ver.includes(rol) ? "bold" : "",
                      }}
                    >
                      {rol}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  type="number"
                  label={"Orden"}
                  {...defaultPropsGenerator("orden", true, true)}
                />
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
