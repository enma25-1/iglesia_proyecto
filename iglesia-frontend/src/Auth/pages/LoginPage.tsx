import {
  TextField,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useAuthStore, useForm, useLocalStorage } from "../../hooks";
import Button from "@mui/material/Button";
import { AuthLayout } from "../Layout/AuthLayout";
import { useMemo, useEffect, useState } from "react";
import { required } from "../../helpers";
import { DataAlerta } from "../../App/components";
import { toast } from "react-toastify";
import { LoginParams } from "../../store/interfaces";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const keyFormStorage = "formValues";
export const LoginPage = () => {
  const [storedValues, setStoredValues] = useLocalStorage<LoginParams>(
    keyFormStorage,
    {
      username: "",
      password: "",
    }
  );
  const [rememberPassword, setRememberPassword] = useLocalStorage(
    "rememberPassword",
    true
  );
  const [showPass, setshowPass] = useState(false);
  const config = useMemo(
    () => ({
      username: [required],
      password: [required],
    }),
    []
  );
  const {
    formValues,
    errorValues,
    handleChange,
    setisSubmited,
    isFormInvalid,
    handleBlur,
    isFormInvalidSubmit,
    // setformValues,
  } = useForm(storedValues, config);
  const { onStartLogin, errorMessage } = useAuthStore();
  const loginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setisSubmited(true);
    handleBlur();
    if (isFormInvalidSubmit(formValues)) {
      return;
    }

    if (rememberPassword) {
      setStoredValues(formValues);
    } else {
      localStorage.removeItem(keyFormStorage);
    }

    onStartLogin(formValues);
  };
  useEffect(() => {
    if (errorMessage !== undefined) {
      toast.error(<DataAlerta titulo={errorMessage} subtitulo="" enlace="" />, {
        position: "top-center",
      });
    }
  }, [errorMessage]);

  return (
    <AuthLayout title="Iniciar sesión">
      <form onSubmit={loginSubmit}>
        {/* <h2> {isFormInvalid ? "Invalido" : "valido"}</h2> */}
        <TextField
          sx={{ mt: 1 }}
          fullWidth
          label="Usuario"
          value={formValues.username}
          onChange={handleChange}
          name="username"
          error={errorValues.username.length > 0}
          helperText={errorValues.username.join(" - ")}
          onBlur={handleBlur}
        />
        <TextField
          sx={{ mt: 1 }}
          fullWidth
          type={showPass ? "text" : "password"}
          label="Contraseña"
          value={formValues.password}
          onChange={handleChange}
          name="password"
          error={errorValues.password.length > 0}
          helperText={errorValues.password.join(" - ")}
          onBlur={handleBlur}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle-mostrar-contraseña"
                  onClick={() => {
                    setshowPass(!showPass);
                  }}
                >
                  {showPass ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          sx={{ mt: 2 }}
          variant="contained"
          color={isFormInvalid ? "error" : "primary"}
          fullWidth
          type="submit"
        >
          INICIAR SESIÓN
        </Button>
        <FormControlLabel
          control={
            <Checkbox
              checked={rememberPassword}
              onChange={(e) => setRememberPassword(e.target.checked)}
              name="rememberPassword"
              color="secondary"
            />
          }
          label="Recordar Credenciales"
        />
      </form>
    </AuthLayout>
  );
};
