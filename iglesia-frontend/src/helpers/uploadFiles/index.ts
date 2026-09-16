import { clienteAxios } from "../../api";

export interface FileData {
  name: string;
  file: File;
}

export const fileUpload = async (file: File | null) => {
  if (!file) {
    return { url: "", error: false };
  }
  const formData = new FormData();
  formData.append("upload_preset", "react-barberia");
  formData.append("file", file);
  try {
    const resp = await clienteAxios.post("/upload/", formData);
    console.log({ resp });

    return { url: resp.data.file.path, error: false };
  } catch (error) {
    console.log({ error });

    return { url: "", error: true };
  }
};

// MULTIPLES
export interface PhotoDataMultiple {
  eliminados: string[];
  antiguos: string[];
  newFiles: FileData[];
}
export function processObject(obj: { [x: string]: PhotoDataMultiple }) {
  let values: { [key: string]: string[] } = {};
  let eliminados: string[] = [];

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      // let antiguosFiltrados = obj[key].antiguos.filter(
      //   (url) => !obj[key].eliminados.includes(url)
      // );
      let antiguos = obj[key].antiguos;
      let newsToShowNames = obj[key].newFiles.map((item) => item.name);
      values[key] = [...antiguos, ...newsToShowNames];
      eliminados = [...eliminados, ...obj[key].eliminados];
    }
  }

  return {
    values: values,
    eliminados: eliminados,
  };
}
export const uploadAllFiles = async (obj: {
  [x: string]: PhotoDataMultiple;
}) => {
  let error = false;
  const values: { [x: string]: string[] } = {}; // Add an index signature

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const element = obj[key];
      const newFiles = element.newFiles;

      const urls = [];
      for (let i = 0; i < newFiles.length; i++) {
        const fileObj = newFiles[i];
        const file = fileObj.file;

        const uploadResult = await fileUpload(file);
        if (uploadResult.error) {
          error = true;
        } else {
          urls.push(uploadResult.url);
        }
      }

      values[key] = [...urls, ...obj[key].antiguos];
    }
  }

  return { error, values };
};
// SINGULAR
export interface PhotoData {
  eliminado: string;
  antiguo: string;
  newFile: FileData | null;
}

export function processSingleObject(obj: { [x: string]: PhotoData }) {
  let values: { [key: string]: string } = {};
  let eliminados: string[] = [];

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      let antiguo = obj[key].antiguo;
      let newFileName = obj[key].newFile?.name;
      values[key] = newFileName || antiguo;
      if (obj[key].eliminado !== "") {
        eliminados.push(obj[key].eliminado);
      }
    }
  }

  return {
    values: values,
    eliminados: eliminados,
  };
}

export const uploadSingleFile = async (obj: { [x: string]: PhotoData }) => {
  let error = false;
  const values: { [x: string]: string } = {}; // Add an index signature

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const element = obj[key];
      const newFile = element.newFile;

      if (newFile) {
        const uploadResult = await fileUpload(newFile.file);
        if (uploadResult.error) {
          error = true;
        } else {
          values[key] = uploadResult.url;
        }
      } else {
        values[key] = element.antiguo;
      }
    }
  }

  return { error, values };
};
