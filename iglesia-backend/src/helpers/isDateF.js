 
// Definir la función isDate
const isDate = (value) => typeof Date.parse(value) === "number";

export const isDateF = (value, { req, location, path }) => {
  if (!value) {
    return false;
  }
  const fecha = isDate(value);
  return fecha;
};
