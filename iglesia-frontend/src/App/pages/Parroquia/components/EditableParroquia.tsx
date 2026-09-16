import { Acciones } from "../../../components";
import { StyledTableCell, StyledTableRow } from "../../../components/style";
import { ParroquiaActions, ParroquiaItem } from "..";

import { useForm } from "../../../../hooks";
import { Dispatch, useMemo } from "react";
import { handleSocket, required } from "../../../../helpers";
import { Action } from "../../../../interfaces/global";
import { CancelOutlined, Check } from "@mui/icons-material";
import {
  Autocomplete,
  IconButton,
  InputAdornment,
  LinearProgress,
  TextField,
  Tooltip,
} from "@mui/material";

import { usePageStore } from "../../Page";
import { useDebouncedCallback, useHttp } from "../../../hooks";
import { useFieldProps } from "../../../hooks/useFieldProps";
import { useNavigate } from "react-router-dom";
import { DeptoForeign } from "../../Depto";
import { MunicipioForeign } from "../../Depto/components/Municipio/interfaces";
import { DistritoForeign } from "../../Depto/components/Distrito/interfaces";
export interface SearchDistritoProps {
  search: string;
  deptoId: string;
  municipioId?: string;
}
export const bodySearchDistrito: SearchDistritoProps = {
  deptoId: "",
  search: "",
};
export interface SearchMunicipioProps {
  search: string;
  deptoId: string;
}
export const bodySearchMunicipio: SearchMunicipioProps = {
  deptoId: "",
  search: "",
};

interface EditableParroquiaProps extends ParroquiaActions {
  parroquia: ParroquiaItem;
  esNuevo?: boolean;
  actionsJoins?: Action[];
  setAgregando?: Dispatch<React.SetStateAction<boolean>>;
  setEditando: Dispatch<React.SetStateAction<boolean>>;
}

export const EditableParroquia = ({
  parroquia,
  setAgregando,
  setEditando,
  esNuevo,
  actionsJoins = [],
  onAgregarParroquia,
  onEditParroquia,
}: EditableParroquiaProps) => {
  const { noTienePermiso, getPathPage } = usePageStore();
  const navigate = useNavigate();
  const config = useMemo(
    () => ({
      "depto.name": [required],
      "distrito.name": [required],
      "municipio.name": [required],
      name: [required],
      direccion: [required],
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
    setformValues,
  } = useForm(parroquia, config);

  const onClickEditar = () => {
    if (noTienePermiso("Parroquia", "update")) return;
    if (esNuevo) {
      return setAgregando!(false);
    }
    setEditando(false);
  };
  const handleGuardar = async () => {
    const error = await onAgregarParroquia(formValues);
    console.log({ error });

    setCargandoSubmit(false);
    handleSocket(error);
    if (error.error) return;
    onNewForm(parroquia);
  };

  const handleEditar = async () => {
    const error = await onEditParroquia(formValues);
    console.log({ error });

    setCargandoSubmit(false);
    handleSocket(error);
    if (error.error) return;
    setEditando(false);
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

  // const [deptosData, setDeptosData] = useState<DeptoSuc[]>([formValues.depto]);

  // const handleSearchDepto = async ({ search }: searchDeptoProps) => {
  //   if (required(search) !== "") return;
  //   const { data } = await searchDepto({ search });
  //   setDeptosData(data.length === 0 ? [formValues.depto] : data);
  // };
  // const debounceSearchDepto = useDebouncedCallback(handleSearchDepto);
  const { data, loading, refetchWithNewBody } = useHttp<
    DeptoForeign[],
    { search: string }
  >({
    initialUrl: "/depto/search",
    initialMethod: "post",
    initialBody: {
      search: "",
    },
    initialData: [],
  });

  const {
    data: dataMunicipios,
    loading: loadingMunicipios,
    refetchWithNewBody: refetchWithNewBodyMunicipios,
  } = useHttp<MunicipioForeign[], SearchMunicipioProps>({
    initialUrl: "/municipio/searchByDepto",
    initialMethod: "post",
    initialBody: bodySearchMunicipio,
    initialData: [],
  });

  const {
    data: dataDistritos,
    loading: loadingDistritos,
    refetchWithNewBody: refetchWithNewBodyDistritos,
  } = useHttp<DistritoForeign[], SearchDistritoProps>({
    initialUrl: "/distrito/searchByDepto",
    initialMethod: "post",
    initialBody: bodySearchDistrito,
    initialData: [],
  });
  const debounceSearchDepto = useDebouncedCallback(refetchWithNewBody);

  const debounceSearchMunicipio = useDebouncedCallback(
    refetchWithNewBodyMunicipios
  );

  const debounceSearchDistrito = useDebouncedCallback(
    refetchWithNewBodyDistritos
  );

  const { defaultPropsGenerator } = useFieldProps({
    config,
    formValues,
    errorValues,
    handleChange,
    handleBlur,
    handleKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && e.shiftKey) {
        onSubmit();
      }
      if (e.key === "Escape") {
        onClickEditar();
      }
    },
  });
  const { Icono, path } = useMemo(() => getPathPage("Parroquia", true), []);
  return (
    <StyledTableRow key={parroquia._id} crud={parroquia.crud}>
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
      <>
        <StyledTableCell>
          <Autocomplete
            options={[formValues.depto, ...data].filter(Boolean)}
            disableClearable={false}
            value={formValues.depto}
            getOptionLabel={(value) => value?.name || ""}
            isOptionEqualToValue={(option, value) => option?._id === value?._id}
            onChange={(_, newValue) => {
              if (!newValue) return;
              setformValues((prev) => ({
                ...prev,
                depto: newValue,
                municipio: {
                  _id: "",
                  name: "",
                },
                distrito: {
                  _id: "",
                  name: "",
                },
              }));

              refetchWithNewBodyMunicipios({
                deptoId: newValue._id ?? "",
                search: "",
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                {...defaultPropsGenerator("depto.name", true, false)}
                autoFocus
                onChange={({ target }) => {
                  debounceSearchDepto({ search: target.value });
                }}
                InputProps={{
                  ...params.InputProps,
                  sx: { paddingRight: "0px !important" },
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title={`Agregar ${path}`}>
                        <IconButton
                          aria-label=""
                          onClick={() => {
                            navigate(path);
                          }}
                        >
                          {Icono}
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          {loading && <LinearProgress color="primary" variant="query" />}
        </StyledTableCell>
        <StyledTableCell>
          <Autocomplete
            options={[formValues.municipio, ...dataMunicipios].filter(Boolean)}
            disabled={!formValues.depto?.name}
            disableClearable={false}
            value={formValues.municipio}
            getOptionLabel={(value) => value?.name || ""}
            isOptionEqualToValue={(option, value) => option?._id === value?._id}
            onChange={(_, newValue) => {
              if (!newValue) return;
              setformValues((prev) => ({
                ...prev,
                municipio: newValue,
                distrito: {
                  _id: "",
                  name: "",
                },
              }));

              refetchWithNewBodyDistritos({
                deptoId: formValues.depto._id ?? "",
                municipioId: newValue._id ?? "",
                search: "",
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                {...defaultPropsGenerator("municipio.name", true, false)}
                onChange={({ target }) => {
                  debounceSearchMunicipio({
                    search: target.value,
                    deptoId: formValues.depto._id ?? "",
                  });
                }}
              />
            )}
          />
          {loadingMunicipios && (
            <LinearProgress color="primary" variant="query" />
          )}
        </StyledTableCell>
        <StyledTableCell>
          <Autocomplete
            options={[formValues.distrito, ...dataDistritos].filter(Boolean)}
            disabled={!formValues.municipio?.name}
            disableClearable={false}
            value={formValues.distrito}
            getOptionLabel={(value) => value?.name || ""}
            isOptionEqualToValue={(option, value) => option?._id === value?._id}
            onChange={(_, newValue) => {
              if (!newValue) return;

              setformValues((prev) => ({
                ...prev,
                distrito: newValue,
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                {...defaultPropsGenerator("distrito.name", true, false)}
                onChange={({ target }) => {
                  debounceSearchDistrito({
                    search: target.value,
                    deptoId: formValues.depto._id ?? "",
                    municipioId: formValues.municipio._id ?? "",
                  });
                }}
              />
            )}
          />
          {loadingDistritos && (
            <LinearProgress color="primary" variant="query" />
          )}
        </StyledTableCell>
        <StyledTableCell>
          <TextField {...defaultPropsGenerator("name", true, true)} />
        </StyledTableCell>

        <StyledTableCell>
          <TextField {...defaultPropsGenerator("direccion", true, true)} />
        </StyledTableCell>
      </>
    </StyledTableRow>
  );
};
