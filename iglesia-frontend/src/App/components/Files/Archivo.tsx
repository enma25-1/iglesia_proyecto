import { Avatar, Badge, Box, IconButton, Typography } from "@mui/material";
import { useRef } from "react";
import { Delete } from "@mui/icons-material";
import { processSingleObject, PhotoData } from "../../../helpers";
import { clienteAxios } from "../../../api";

interface PhotoDataIndexSignature {
  [key: string]: PhotoData;
}

export const Archivo = <T extends PhotoDataIndexSignature>({
  dataFile,
  error,
  helperText,
  label,
  propiedad,
  setDataFile,
  setformValues,
  handleBlur,
  local,
}: {
  dataFile?: PhotoData;
  label: string;
  propiedad: keyof T; // propiedad es una clave de T
  error: boolean;
  helperText: string;
  setDataFile: React.Dispatch<React.SetStateAction<T>>;
  setformValues: React.Dispatch<React.SetStateAction<any>>;
  handleBlur: () => void;
  local?: boolean;
}) => {
  const inputEl = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event?.target?.files ? event.target.files[0] : undefined;

    if (!file) {
      return null;
    }

    setDataFile((prev) => {
      const resPrev = {
        ...prev,
        [propiedad]: {
          ...prev[propiedad],
          eliminado: prev[propiedad].antiguo,
          newFile: {
            name: file.name,
            file: file,
          },
        },
      };

      const { values } = processSingleObject(resPrev);

      setformValues((prev: any) => ({ ...prev, ...values }));
      handleBlur();
      return resPrev;
    });
  };

  const handleDeleteImageNew = () => {
    setDataFile((prev) => {
      const resPrev = {
        ...prev,
        [propiedad]: {
          ...prev[propiedad],
          eliminado: prev[propiedad].antiguo,
          newFile: undefined,
          antiguo: "",
        },
      };
      const { values } = processSingleObject(resPrev);

      setformValues((prev: any) => ({ ...prev, ...values }));
      handleBlur();
      return resPrev;
    });
  };
  const handleDeleteImageOld = () => {
    setDataFile((prev) => {
      const resPrev = {
        ...prev,
        [propiedad]: {
          ...prev[propiedad],
          eliminado: prev[propiedad].antiguo,
          antiguo: "",
        },
      };

      const { values } = processSingleObject(resPrev);

      setformValues((prev: any) => ({ ...prev, ...values }));
      handleBlur();
      return resPrev;
    });
  };

  const handleUploadClick = () => {
    inputEl.current?.click();
  };

  if (!dataFile) {
    return null;
  }
  return (
    <>
      <Box
        className="fullWidth"
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        mt={1}
      >
        <input
          type="file"
          style={{ display: "none" }}
          ref={inputEl}
          onChange={handleFileUpload}
        />
        <Badge
          badgeContent={
            <IconButton
              disabled={!dataFile?.antiguo && !dataFile?.newFile}
              aria-label=""
              onClick={() => {
                dataFile?.newFile?.file
                  ? handleDeleteImageNew()
                  : handleDeleteImageOld();
              }}
              size="small"
            >
              <Delete color="error" fontSize="small" />
            </IconButton>
          }
        >
          <Avatar
            onClick={handleUploadClick}
            alt={label}
            src={
              dataFile.newFile?.file
                ? URL.createObjectURL(dataFile.newFile.file)
                : local
                  ? clienteAxios.defaults.baseURL + dataFile?.antiguo
                  : dataFile?.antiguo
            }
            sx={{
              width: 125,
              height: 125,
              transition: "opacity .3s",
              ":hover": {
                opacity: 0.75,
              },
            }}
          />
        </Badge>
        <Typography variant="overline" color={error ? "error" : "secondary"}>
          {dataFile?.newFile?.name || label} {error && ` - ${helperText}`}
        </Typography>
      </Box>
    </>
  );
};
