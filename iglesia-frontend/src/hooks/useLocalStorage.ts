import { useState } from "react";

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  // Estado para almacenar nuestro valor
  // Pasamos una función inicial al useState para que la lógica solo se ejecute una vez
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Obtenemos del local storage por la key
      const item = window.localStorage.getItem(key);
      // Parseamos el item y lo retornamos o retornamos initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Si hay un error, retornamos el valor inicial
      console.log(error);
      return initialValue;
    }
  });

  // Retornamos una función envolvente para permitirnos llamarla de manera segura
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Permitimos value ser una función para que tengamos la misma API que useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Guardamos el estado
      setStoredValue(valueToStore);
      // Guardamos en local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // Un error más avanzado basado en el código de error podría ser más apropiado
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
};
