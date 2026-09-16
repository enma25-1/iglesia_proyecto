import { FormEvent, useEffect, useMemo } from "react";
import { useForm } from "../../../hooks";
import { Box, TextField, IconButton, InputAdornment } from "@mui/material";
import { Cancel } from "@mui/icons-material";

export const Buscador = ({
  label = "Buscar",
  buscando,
  onSearch,
  onSearchCancel,
  cargando,
  busqueda,
}: {
  label?: string;
  buscando: boolean;
  cargando: boolean;
  onSearch: (arg: string) => void;
  onSearchCancel: () => void;
  busqueda?: string;
}) => {
  const initialValues = useMemo<{ search: string }>(
    () => ({
      search: "",
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
  console.log(initialValues);
  useEffect(() => {
    if (busqueda) {
      setformValues({ search: busqueda });
    }
  }, [busqueda]);

  const onLeaveSearch = () => {
    setformValues({ search: "" });
    onSearchCancel();
  };
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (cargando) return;
    setisSubmited(true);
    if (formValues.search === "") {
      if (buscando) {
        onLeaveSearch();
      }
      return;
    }
    onSearch(formValues.search);
  };
  return (
    <Box component={"form"} onSubmit={onSubmit} sx={{ width: "100%" }}>
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
              {buscando && (
                <IconButton
                  disabled={cargando}
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
