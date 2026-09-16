import {
  Box,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Typography,
} from "@mui/material";
import { useRef } from "react";
import { AddAPhoto, Delete, OpenInBrowser } from "@mui/icons-material";
import { FileData, PhotoDataMultiple, processObject } from "../../../helpers";
interface PhotoDataIndexSignature {
  [key: string]: PhotoDataMultiple;
}

export const ArchivoMultiple = <T extends PhotoDataIndexSignature>({
  dataFile,
  error,
  helperText,
  label,
  propiedad,
  setDataFile,
  setformValues,
  handleBlur,
}: {
  dataFile?: PhotoDataMultiple;
  label: string;
  propiedad: keyof T; // propiedad es una clave de T
  error: boolean;
  helperText: string;
  setDataFile: React.Dispatch<React.SetStateAction<T>>;
  setformValues: React.Dispatch<React.SetStateAction<any>>;
  handleBlur: () => void;
}) => {
  const inputEl = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target?.files?.length === 0) return;
    const filesArray = Array.from(event.target.files || []);
    //* files

    // Now it should print the expected array

    const formatedFilesArray: PhotoDataMultiple["newFiles"] = filesArray.map(
      (item) => ({
        name: item.name,
        file: item,
      })
    );

    setDataFile((prev) => {
      const resPrev = {
        ...prev,
        [propiedad]: {
          ...prev[propiedad],
          newFiles: [...prev[propiedad].newFiles, ...formatedFilesArray],
        },
      };

      const { values } = processObject(resPrev);

      setformValues((prev: any) => ({ ...prev, ...values }));
      handleBlur();
      return resPrev;
    });
  };

  const handleDeleteImageNew = (fileNuevo: FileData) => {
    setDataFile((prev) => {
      const resPrev = {
        ...prev,
        [propiedad]: {
          ...prev[propiedad],
          newFiles: prev[propiedad].newFiles.filter(
            (fileItem) => fileItem.name !== fileNuevo.name
          ),
        },
      };
      const { values } = processObject(resPrev);

      setformValues((prev: any) => ({ ...prev, ...values }));
      handleBlur();
      return resPrev;
    });
  };
  const handleDeleteImageOld = (oldImage: string) => {
    setDataFile((prev) => {
      const resPrev = {
        ...prev,
        [propiedad]: {
          ...prev[propiedad],
          antiguos: prev[propiedad].antiguos.filter(
            (fileItem) => fileItem !== oldImage
          ),
          eliminados: [...prev[propiedad].eliminados, oldImage],
        },
      };
      const { values } = processObject(resPrev);

      setformValues((prev: any) => ({ ...prev, ...values }));
      handleBlur();
      return resPrev;
    });
  };

  const handleUploadClick = () => {
    inputEl.current?.click();
  };

  // useEffect(() => {
  // const { values } = processObject({ [propiedad]: dataFile });

  // setformValues((prev: any) => ({ ...prev, ...values }));
  // }, [dataFile]);

  return (
    <>
      <>
        <Box display={"flex"} alignItems={"center"}>
          <Typography
            variant="body1"
            color={error ? "error.light" : "secondary"}
          >
            {`${label}: ${helperText}`}
          </Typography>
          <IconButton
            color={error ? "error" : "secondary"}
            aria-label="Subir foto"
            onClick={handleUploadClick}
          >
            <AddAPhoto />
          </IconButton>
        </Box>
        <Box
          className="fullWidth"
          display={"flex"}
          justifyContent={"space-between"}
          flexWrap={"wrap"}
          alignItems={"center"}
        >
          <input
            type="file"
            style={{ display: "none" }}
            ref={inputEl}
            onChange={handleFileUpload}
            multiple
          />

          <ImageList sx={{ width: "100%" }} cols={4} rowHeight={200}>
            {dataFile ? (
              [...dataFile.newFiles].map((fileNuevo) => (
                <ImageListItem key={fileNuevo.name}>
                  <img
                    src={URL.createObjectURL(fileNuevo.file)}
                    alt={fileNuevo.name}
                    loading="lazy"
                  />
                  <ImageListItemBar
                    sx={{
                      background: (theme) => theme.palette.success.dark,
                    }}
                    title={fileNuevo.name}
                    actionIcon={
                      <Box display={"flex"}>
                        <IconButton
                          aria-label="Abrir en el navegador"
                          color="secondary"
                          onClick={() =>
                            window.open(URL.createObjectURL(fileNuevo.file))
                          }
                          size="small"
                        >
                          <OpenInBrowser fontSize="small" />
                        </IconButton>
                        <IconButton
                          aria-label="Eliminar"
                          onClick={() => handleDeleteImageNew(fileNuevo)}
                          size="small"
                        >
                          <Delete color="error" fontSize="small" />
                        </IconButton>
                      </Box>
                    }
                  />
                </ImageListItem>
              ))
            ) : (
              <></>
            )}
            {dataFile ? (
              [...dataFile.antiguos].map((fileOld) => (
                <ImageListItem key={fileOld}>
                  <img
                    src={`${fileOld}`}
                    alt={`Abrir en el navegador`}
                    loading="lazy"
                  />
                  <ImageListItemBar
                    title={`Ver - Eliminar`}
                    actionIcon={
                      <Box display={"flex"}>
                        <IconButton
                          aria-label="Abrir en el navegador"
                          color="secondary"
                          onClick={() => window.open(fileOld)}
                          size="small"
                        >
                          <OpenInBrowser fontSize="small" />
                        </IconButton>
                        <IconButton
                          aria-label="Eliminar"
                          onClick={() => handleDeleteImageOld(fileOld)}
                          size="small"
                        >
                          <Delete color="error" fontSize="small" />
                        </IconButton>
                      </Box>
                    }
                  />
                </ImageListItem>
              ))
            ) : (
              <></>
            )}
          </ImageList>
        </Box>
      </>
    </>
  );
};
