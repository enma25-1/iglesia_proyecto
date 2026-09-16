import { FormEvent, useMemo } from "react";
import { useForm } from "../../../hooks";
import { Box, TextField, IconButton, InputAdornment } from "@mui/material";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";
import { Cancel } from "@mui/icons-material"; 

export const BuscadorPath = ({ label = "Buscar" }: { label?: string }) => {
  const navigate = useNavigate(); 
  const { q = "", buscando = "" } = queryString.parse(location.search) as {
    q: string;
    buscando: string;
  };

  const initialValues = useMemo<{ search: string }>(
    () => ({
      search: String(q),
    }),
    []
  );

  const {
    formValues,
    handleChange,
    setisSubmited,
    // onResetForm,
    setformValues,
  } = useForm(initialValues, {});
  const onLeaveSearch = () => {
    setformValues({ search: "" });
    let params = new URLSearchParams(window.location.search);
    params.set("q", "");
    params.set("buscando", "false");
    navigate(`?${params.toString()}`);
  };
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setisSubmited(true);
    if (formValues.search === "") {
      return onLeaveSearch();
    }
    let params = new URLSearchParams(window.location.search);
    params.set("q", formValues.search);
    params.set("buscando", "true");
    navigate(`?${params.toString()}`);
  };
  return (
    <Box component={"form"} onSubmit={onSubmit}>
      <TextField
        autoFocus
        fullWidth
        size="small"
        variant="outlined"
        label={label}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onLeaveSearch();
          }
        }}
        value={formValues.search}
        onChange={handleChange}
        name="search"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {buscando === "true" && (
                <IconButton
                  aria-label="Cancelar Busqueda"
                  onClick={() => {
                    onLeaveSearch();
                  }}
                  color="error"
                >
                  <Cancel />
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};
