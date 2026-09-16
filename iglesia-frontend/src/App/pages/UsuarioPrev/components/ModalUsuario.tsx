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
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
  MenuItem,
  Switch,
} from "@mui/material";
import { Cancel, Save, Visibility, VisibilityOff } from "@mui/icons-material";
import { Archivo, ModalLayout } from "../../../components";
import {
  PhotoData,
  formatearFecha,
  handleSocket,
  minNoRequired,
  processSingleObject,
  required,
  roles,
  uploadSingleFile,
} from "../../../../helpers";
import { useEffect, useMemo, useState } from "react";
import { useForm, useProvideSocket } from "../../../../hooks";
import { useModalConfig } from "../../../hooks";
import { useUsuarioStore } from "../hooks/useUsuarioStore";
import { ErrorSocket } from "../../../../interfaces/global";
import { SocketEmitUsuario } from "../helpers";
import { handleNavigation, useFieldProps } from "../../../hooks/useFieldProps";
import { UsuarioItem } from "../interfaces";
import { toast } from "react-toastify";

export const ModalUsuario = () => {
  // Hooks
  const { itemActive, itemDefault, openModal, setItemActive, setOpenModal } =
    useUsuarioStore();
  const { columns, idModal, vhContainer, width } =
    useModalConfig("modalUsuario");
  const { socket } = useProvideSocket();

  const editar = useMemo(() => itemActive._id, [itemActive]);
  const [showPass, setShowPass] = useState(false);

  // Configuración de validación
  const config = useMemo(
    () => ({
      lastname: [required],
      name: [required],
      username: [required],
      tel: [required],
      photo: [],
      dui: [
        // (e: string) => {
        //   if (
        //     // (allValues.rol === "EMPLEADO" || allValues.rol === "GERENTE") &&
        //     String(e).trim() === ""
        //   ) {
        //     return "EL DUI ES REQUERIDO";
        //   }
        //   return "";
        // },
      ],

      newPassword: editar
        ? [(value: string) => minNoRequired(value, 6)]
        : [required, (value: string) => minNoRequired(value, 6)],
      rol: [required],
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
  } = useForm(
    {
      ...itemDefault,
      newPassword: "",
    },
    config,
  );

  type ItemKeys = keyof UsuarioItem;

  const [images, setImages] = useState<{
    [K in ItemKeys]?: PhotoData;
  }>({
    photo: {
      antiguo: formValues.photo || "",
      eliminado: "",
      newFile: null,
    },
  });

  // Funciones de manejo
  const handleGuardar = async () => {
    const { values, error } = await uploadSingleFile(images);
    if (error) {
      toast.error("Hubo un error al subir las imagenes, INTENTE MAS TARDE");
      return setCargandoSubmit(false);
    }
    const formAllData = {
      ...formValues,
      ...values,
    };

    socket?.emit(
      SocketEmitUsuario.agregar,
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
    const { eliminados } = processSingleObject(images);
    const { values, error } = await uploadSingleFile(images);

    if (error) {
      toast.error("Hubo un error al subir las imagenes");
      return setCargandoSubmit(false);
    }
    const formAllData = {
      ...formValues,
      ...values,
    };

    socket?.emit(
      SocketEmitUsuario.editar,
      { data: formAllData, eliminados },
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
    onNewForm({
      ...itemActive,
      newPassword: "",
    });
    setImages({
      photo: {
        antiguo: itemActive.photo || "",
        eliminado: "",
        newFile: null,
      },
    });
  }, [itemActive]);

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

  //Suc

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
              {editar && (
                <Tooltip title="Estado">
                  <Switch
                    checked={formValues.estado}
                    onChange={(e) => {
                      setformValues({
                        ...formValues,
                        estado: e.target.checked,
                      });
                    }}
                    inputProps={{ "aria-label": "Value" }}
                    color="success"
                  />
                </Tooltip>
              )}
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
                {JSON.stringify({ errorValues })}
                <Archivo<{
                  [K in ItemKeys]?: PhotoData;
                }>
                  label="Fotos"
                  propiedad="photo"
                  dataFile={images["photo"]}
                  setDataFile={setImages}
                  //FORM
                  setformValues={setformValues}
                  handleBlur={handleBlur}
                  error={errorValues.photo.length > 0}
                  helperText={errorValues.photo.join(" - ")}
                />
                <TextField
                  autoFocus
                  label={"Apellido"}
                  {...defaultPropsGenerator("lastname", true, true)}
                />
                <TextField
                  label={"Nombre"}
                  {...defaultPropsGenerator("name", true, true)}
                />

                <TextField
                  label={"Usuario"}
                  {...defaultPropsGenerator("username", true, true)}
                />
                <TextField
                  label={"Tel"}
                  {...defaultPropsGenerator("tel", true, true)}
                />
                <TextField
                  label={"Rol"}
                  {...defaultPropsGenerator("rol", true, true)}
                  select
                >
                  {roles.map((rol) => (
                    <MenuItem key={rol} value={rol}>
                      {rol}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  type={showPass ? "text" : "password"}
                  label={"Nueva Contraseña"}
                  {...defaultPropsGenerator("newPassword", true, true)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle-mostrar-contraseña"
                          onClick={() => {
                            setShowPass(!showPass);
                          }}
                        >
                          {showPass ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </StyledGridContainer>
            </StyledContainerForm>
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
