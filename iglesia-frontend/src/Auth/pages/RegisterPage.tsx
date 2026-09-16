import { TextField, Box, Typography } from "@mui/material";
import { useAuthStore, useForm } from "../../hooks";
import Button from "@mui/material/Button";
import { AuthLayout } from "../Layout/AuthLayout";
import { useMemo, useEffect } from "react";
import { required, validarEmail } from "../../helpers";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { DataAlerta } from "../../App/components";
import { RegisterParams } from "../../store/interfaces";

interface RegisterInterface extends RegisterParams {
  password2: string;
}

export const RegisterPage = () => {
  const initialValues = useMemo<RegisterInterface>(
    () => ({
      username: "",
      lastname: "",
      name: "",
      password: "",
      password2: "",
      tel: "",
    }),
    []
  );

  const config = useMemo(
    () => ({
      name: [required],
      username: [required, validarEmail],
      password: [
        required,
        (a: string | string[] | number, b: RegisterInterface) => {
          if (a !== b.password2) {
            return "Las contraseñas no coinciden";
          }
          return "";
        },
      ],
      password2: [
        required,
        (a: string | string[] | number, b: RegisterInterface) => {
          if (a !== b.password) {
            return "Las contraseñas no coinciden";
          }
          return "";
        },
      ],
      lastname: [required],
      tel: [required],
    }),
    []
  );
  const { onStartRegister, errorMessage } = useAuthStore();
  const {
    errorValues,
    formValues,
    handleBlur,
    handleChange,
    isFormInvalid,
    isFormInvalidSubmit,
    setisSubmited,
  } = useForm(initialValues, config);
  const { username, lastname, name, password, password2, tel } = formValues;
  const loginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setisSubmited(true);
    if (isFormInvalidSubmit(formValues)) {
      return;
    }
    onStartRegister({ username, name, password, lastname, tel });
  };
  useEffect(() => {
    if (errorMessage !== undefined) {
      toast.error(<DataAlerta titulo={errorMessage} subtitulo="" enlace="" />, {
        position: "top-center",
      });
    }
  }, [errorMessage]);

  return (
    <AuthLayout title="Registrarse">
      <form onSubmit={loginSubmit}>
        <TextField
          sx={{ mt: 1 }}
          fullWidth
          label="Name"
          value={name}
          onChange={handleChange}
          name="name"
          error={errorValues.name.length > 0}
          helperText={errorValues.name.join(" - ")}
          onBlur={handleBlur}
        />
        <TextField
          sx={{ mt: 1 }}
          fullWidth
          label="Apellido"
          value={lastname}
          onChange={handleChange}
          name="lastname"
          error={errorValues.lastname.length > 0}
          helperText={errorValues.lastname.join(" - ")}
          onBlur={handleBlur}
        />
        <TextField
          sx={{ mt: 1 }}
          fullWidth
          label="Usuario"
          value={username}
          onChange={handleChange}
          name="username"
          error={errorValues.username.length > 0}
          helperText={errorValues.username.join(" - ")}
          onBlur={handleBlur}
        />
        <TextField
          sx={{ mt: 1 }}
          fullWidth
          label="Teléfono"
          value={tel}
          onChange={handleChange}
          name="tel"
          error={errorValues.tel.length > 0}
          helperText={errorValues.tel.join(" - ")}
          onBlur={handleBlur}
        />
        <TextField
          sx={{ mt: 1 }}
          fullWidth
          type="password"
          label="Password"
          value={password}
          onChange={handleChange}
          name="password"
          error={errorValues.password.length > 0}
          helperText={errorValues.password.join(" - ")}
          onBlur={handleBlur}
        />
        <TextField
          sx={{ mt: 1 }}
          fullWidth
          type="password"
          label="Confirmar Password"
          value={password2}
          onChange={handleChange}
          name="password2"
          error={errorValues.password2.length > 0}
          helperText={errorValues.password2.join(" - ")}
          onBlur={handleBlur}
        />
        <Button
          sx={{ mt: 2 }}
          variant="contained"
          color={isFormInvalid ? "error" : "primary"}
          fullWidth
          type="submit"
        >
          SIGN UP
        </Button>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="subtitle1" color="secondary.light">
            Ya tienes una cuenta?
          </Typography>
          <Link to={"/auth/login"}>
            <Typography
              variant="subtitle1"
              color="secondary.light"
              sx={{
                ":hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Inicia Sesión
            </Typography>
          </Link>
        </Box>
      </form>
    </AuthLayout>
  );
};
