import { KeyboardEvent } from "react";

export const required = (value: string | string[] | number) => {
  if (typeof value === "string" && value.trim() === "") {
    return `El campo es obligatorio`;
  }

  if (typeof value === "number" && value <= 0) {
    return `Tiene que ser mayor a 0`;
  }
  if (typeof value === "object" && value.length === 0) {
    return `El campo es obligatorio`;
  }
  return "";
};
export const min = (value: number, min: number) => {
  if (value < min) {
    return `Valor Minimo: ${min}`;
  }

  return "";
};

export const minNoRequired = (
  value: string | string[] | number,
  min: number,
) => {
  if (typeof value === "string" && value.trim() === "") {
    return "";
  }
  if (typeof value === "string" && value.length < min) {
    return `La contraseña debe tener minimo ${min} caracteres`;
  }
  return "";
};

export const validarEmail = (value: string | string[] | number) => {
  if (
    typeof value === "string" &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
  ) {
    return "Invalid username format";
  }
  return "";
};

export const validateFunction = (e: KeyboardEvent) =>
  isNaN(Number(e.key)) || !e.altKey ? true : false;
