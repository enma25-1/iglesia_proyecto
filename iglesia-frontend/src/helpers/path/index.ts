export const convertirPath = (nombre: string) => {
  // Primero, quitamos las tildes
  nombre = nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Luego, reemplazamos los espacios por guiones bajos y convertimos a minúsculas
  nombre = nombre.replace(/\s/g, "_").toLowerCase();

  // Finalmente, quitamos los caracteres especiales
  nombre = nombre.replace(/[^a-z0-9_]/g, "");

  return nombre;
};
export const getSubPath = () => {
  const parts =location.hash.split("/");
  let params = new URLSearchParams(window.location.search);
  parts.pop(); // Elimina el último elemento del array
  return `${parts.join("/")}?${params.toString()}`; // Une los elementos del array en una cadena
};
export const isThereNextPath = (prevPath: string): boolean => {
  const pathname =location.hash;
  // Eliminamos las barras diagonales al principio y al final para normalizar los paths
  const normalizedPathname = pathname.replace(/^\/|\/$/g, "");

  const normalizedPrevPath = prevPath.replace(/^\/|\/$/g, "");
  // Dividimos los paths en segmentos
  const segmentsPathname = normalizedPathname.split("/");

  const segmentsPrevPath = normalizedPrevPath.split("/");

  // Comparamos los segmentos para verificar si hay una ruta después
  if (segmentsPathname.slice(0, -1).join("/") === segmentsPrevPath.join("/")) {
    return true;
  } else {
    return false;
  }
};

export const hasSubroute = (pathname: string, path: string) => {
  // Elimina la barra inicial y divide la ruta en segmentos
  const segments = pathname.replace(/^\//, "").split("/");
  // Encuentra el índice del segmento de ruta en los segmentos
  const pathIndex = segments.indexOf(path);
  // Si la ruta no se encuentra en los segmentos, devuelve false
  if (pathIndex === -1) return false;
  // Si hay un segmento después del segmento de ruta, devuelve true
  return pathIndex < segments.length - 1;
};
export const obtenerUltimaRuta = (url: string) => {
  // Divide la URL en segmentos basándose en las barras diagonales
  const segmentos = url.split("/");

  // Devuelve el último segmento no vacío
  return segmentos.reverse().find((segmento) => segmento !== "");
};
