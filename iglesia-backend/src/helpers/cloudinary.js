const cloudinary = require("cloudinary").v2;

export const deleteFile = async (url) => {
  if (url === "") {
    return "";
  }
  // Extrae el ID del archivo de la URL
  let publicId = url.split("/").pop().split(".")[0];

  try {
    // Llama al método destroy de Cloudinary para eliminar el archivo\
    let result = await cloudinary.uploader.destroy(`barberia/${publicId}`);
    // Comprueba si el archivo se eliminó correctamente
    if (result.result === "ok") {
      return `Archivo ${publicId} eliminado correctamente.`;
    } else {
      return `No se pudo eliminar el archivo ${publicId}.`;
    }
  } catch (error) {
    console.log({ error });
    return `Error al eliminar el archivo ${publicId}: `;
  }
};

// Elimina un archivo almacenado localmente en la carpeta `uploads/`.
// Acepta una URL completa, un path relativo, o solo el nombre del archivo.
export const deleteFileLocal = async (input) => {
  if (!input) return "";
  const fs = require("fs");
  const path = require("path");

  try {
    // Extraer nombre de archivo si se recibe una URL o path
    let filename = input;
    if (filename.includes("/")) {
      filename = filename.split("/").pop();
    }
    // Eliminar query strings si los hubiera
    filename = filename.split("?")[0];

    const uploadsPath = path.join(process.cwd(), "uploads", filename);

    if (!fs.existsSync(uploadsPath)) {
      return `Archivo ${filename} no existe en uploads/`;
    }

    await fs.promises.unlink(uploadsPath);
    return `Archivo ${filename} eliminado correctamente.`;
  } catch (error) {
    console.log({ error });
    return `Error al eliminar el archivo ${input}: ${error.message}`;
  }
};
