import {
  StyledContainerForm,
  StyledGridContainer,
  StyledModalBoxFooter,
  StyledModalBoxHeader,
  StyledTypographyFooter,
  StyledTypographyFooterSpan,
  StyledTypographyHeader,
} from "../../components/style";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Cancel, Save, Visibility, VisibilityOff } from "@mui/icons-material";
import { Archivo, ModalLayout } from "../../components";
import {
  PhotoData,
  formatearFecha,
  minNoRequired,
  processSingleObject,
  required,
  uploadSingleFile,
} from "../../../helpers";
import { useMemo, useState } from "react";
import { useAuthStore, useForm, useUiStore } from "../../../hooks";
import { clienteAxios } from "../../../api";
import { toast } from "react-toastify";
import { useModalConfig } from "../../hooks";
import { Usuario } from "../../../store/interfaces";

// import { useNavigate } from "react-router-dom"; // import { usePath } from "../../../hooks";

// interface CampoFormDinamyc {
//   tipo: "numero" | "doc" | "img" | "texto";
//   validacion: {
//     minMax?: number;
//     tipo: "min" | "max" | "required" | "username";
//   };
//   name: string;
// }
// function getValidations(formularioDinamico: CampoFormDinamyc[]) {
//   const validations: any = {};
//   formularioDinamico.forEach((campo) => {
//     if (campo.validacion.tipo === "required") {
//       validations[campo.name] = [required];
//     } else {
//       validations[campo.name] = [];
//     }
//   });

//   return validations;
// }

// function getInitialValues(formularioDinamico: CampoFormDinamyc[]) {
//   const initialValues: any = {};
//   formularioDinamico.forEach((campo) => {
//     if (campo.tipo === "numero") {
//       initialValues[campo.name] = 0;
//     } else {
//       initialValues[campo.name] = "";
//     }
//   });

//   return initialValues;
// }
// const formularioDinamico: CampoFormDinamyc[] = [
//   {
//     tipo: "img",
//     name: "img1",
//     validacion: {
//       tipo: "required",
//     },
//   },
//   {
//     tipo: "img",
//     name: "logo",
//     validacion: {
//       tipo: "required",
//     },
//   },
//   {
//     tipo: "texto",
//     name: "texto1",
//     validacion: {
//       tipo: "required",
//     },
//   },
//   {
//     tipo: "numero",
//     name: "numero1",
//     validacion: {
//       minMax: 10,
//       tipo: "min",
//     },
//   },
//   {
//     tipo: "doc",
//     name: "doc1",
//     validacion: {
//       tipo: "required",
//     },
//   },
//   {
//     tipo: "img",
//     name: "img2",
//     validacion: {
//       tipo: "required",
//     },
//   },
//   {
//     tipo: "texto",
//     name: "texto2",
//     validacion: {
//       tipo: "username",
//     },
//   },
//   {
//     tipo: "numero",
//     name: "numero2",
//     validacion: {
//       minMax: 20,
//       tipo: "max",
//     },
//   },
//   {
//     tipo: "doc",
//     name: "doc2",
//     validacion: {
//       tipo: "required",
//     },
//   },
//   {
//     tipo: "img",
//     name: "img3",
//     validacion: {
//       tipo: "required",
//     },
//   },
//   {
//     tipo: "texto",
//     name: "texto3",
//     validacion: {
//       tipo: "required",
//     },
//   },
// ];

export const ModalProfile = () => {
  const { setOpenProfileModal, openModalProfile } = useUiStore();
  const { columns, idModal, vhContainer, width } =
    useModalConfig("modalProfile");
  const { usuario, onEditUsuario } = useAuthStore();
  const [showPass, setShowPass] = useState(false);
  const config = useMemo(
    () => ({
      username: [required],
      lastname: [required],
      name: [required],
      tel: [required],
      // logo: [required],
      newPassword: [
        (value: string) => {
          return minNoRequired(value, 6);
        },
      ],
      logo: [required],
    }),
    [],
  );
  const {
    formValues,
    errorValues,
    handleChange,
    setisSubmited,
    isFormInvalid,
    handleBlur,
    isFormInvalidSubmit,
    onResetForm,
    setCargandoSubmit,
    cargandoSubmit,
    setformValues,
    onNewForm,
  } = useForm(
    { ...usuario, newPassword: "" },
    config,
    // getInitialValues(formularioDinamico),
    // getValidations(formularioDinamico)
  );

  type ItemKeys = keyof Usuario;

  const [images, setImages] = useState<{
    [K in ItemKeys]?: PhotoData;
  }>({
    logo: {
      antiguo: formValues.logo || "",
      eliminado: "",
      newFile: null,
    },
  });
  const onHandleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setisSubmited(true);

    if (cargandoSubmit) return;
    setCargandoSubmit(true);

    if (isFormInvalidSubmit({ ...formValues })) {
      setCargandoSubmit(false);
      return;
    }

    try {
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

      await clienteAxios.post("/auth/edit", {
        data: formAllData,
        eliminados,
      });

      onEditUsuario(formAllData);
      toast.success("¡Actualizado con exito!");
      setCargandoSubmit(false);
      setImages({
        logo: {
          antiguo: formAllData.logo || "",
          eliminado: "",
          newFile: null,
        },
      });
      onNewForm(formAllData);
      setOpenProfileModal(false);
    } catch (error: any) {
      console.log(error);
      const msgError =
        error?.response?.data?.msg || "¡No se pudieron actualizar los datos!";
      setCargandoSubmit(false);
      toast.error(msgError);
    }
  };

  return (
    <>
      <ModalLayout
        idModal={idModal}
        open={openModalProfile}
        setOpen={() => {
          setOpenProfileModal(false);
        }}
        vh={vhContainer.height}
        width={width}
      >
        <>
          <StyledModalBoxHeader>
            <StyledTypographyHeader
              color={isFormInvalid ? "error" : "primary"}
              id={idModal}
            >
              MIS DATOS
            </StyledTypographyHeader>
            <Tooltip title="Cancelar">
              <IconButton
                aria-label="Cancelar"
                onClick={() => {
                  setOpenProfileModal(false);
                  onResetForm();
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
                <Archivo<{
                  [K in ItemKeys]?: PhotoData;
                }>
                  label="Logo"
                  propiedad="logo"
                  dataFile={images["logo"]}
                  setDataFile={setImages}
                  //FORM
                  setformValues={setformValues}
                  handleBlur={handleBlur}
                  error={errorValues.logo.length > 0}
                  helperText={errorValues.logo.join(" - ")}
                  local
                />
                <TextField
                  label={"Apellido"}
                  value={formValues.lastname}
                  onChange={handleChange}
                  name="lastname"
                  error={errorValues.lastname.length > 0}
                  helperText={errorValues.lastname.join(" - ")}
                  onBlur={handleBlur}
                />
                <TextField
                  label={"Nombre"}
                  value={formValues.name}
                  onChange={handleChange}
                  name="name"
                  error={errorValues.name.length > 0}
                  helperText={errorValues.name.join(" - ")}
                  onBlur={handleBlur}
                />
                <TextField
                  label={"Usuario"}
                  value={formValues.username}
                  onChange={handleChange}
                  name="username"
                  error={errorValues.username.length > 0}
                  helperText={errorValues.username.join(" - ")}
                  onBlur={handleBlur}
                />
                <TextField
                  label={"Tel"}
                  value={formValues.tel}
                  onChange={handleChange}
                  name="tel"
                  error={errorValues.tel.length > 0}
                  helperText={errorValues.tel.join(" - ")}
                  onBlur={handleBlur}
                />
                <TextField
                  type={showPass ? "text" : "password"}
                  className="fullWidth"
                  label={"Nueva Contraseña"}
                  value={formValues.newPassword}
                  onChange={handleChange}
                  name="newPassword"
                  error={errorValues.newPassword.length > 0}
                  helperText={errorValues.newPassword.join(" - ")}
                  onBlur={handleBlur}
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
                {/* 
{formularioDinamico.map((campo, index) => {
                  if (campo.tipo === "img") {
                    const { ComponentUpload, onSubmitUpload } = useFileUpload({
                      label: campo.name,
                      prevUrl: formValues[campo.name] || "",
                      propiedad: campo.name,
                      error: errorValues[campo.name].length > 0,
                      helperText: errorValues[campo.name].join(" - "),
                      setformValues,
                    });

                    onSubmitUploadFunctions.push(onSubmitUpload);

                    return ComponentUpload;
                  } else {
                    return (
                      <TextField
                        key={index}
                        label={campo.name}
                        value={formValues[campo.name]}
                        onChange={handleChange}
                        name={campo.name}
                        error={
                          errorValues[campo.name] &&
                          errorValues[campo.name].length > 0
                        }
                        helperText={
                          errorValues[campo.name] &&
                          errorValues[campo.name].join(" - ")
                        }
                        onBlur={handleBlur}
                      />
                    );
                  }
                })} */}
              </StyledGridContainer>
            </StyledContainerForm>
            <StyledModalBoxFooter>
              <Box display={"flex"} alignItems={"center"} gap={1}>
                <StyledTypographyFooter
                  color={isFormInvalid ? "error" : "secondary.light"}
                >
                  C:
                  <Typography className="span" component={"span"}>
                    {formatearFecha(usuario.createdAt)}
                  </Typography>
                </StyledTypographyFooter>
                <StyledTypographyFooter
                  color={isFormInvalid ? "error" : "secondary.light"}
                >
                  E:
                  <Typography className="span" component={"span"}>
                    {formatearFecha(usuario.updatedAt)}
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
