export const normalize = (str: string) => {
  return str
    .normalize("NFD") // descomponer caracteres acentuados en su forma básica
    .replace(/[\u0300-\u036f]/g, "") // eliminar diacríticos
    .toLowerCase(); // convertir a minúsculas
};
