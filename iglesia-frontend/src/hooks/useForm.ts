import { ChangeEvent, useCallback, useMemo, useState } from "react";

const getNestedProperty = (obj: any, properties: string[]): any => {
  let property = properties.shift() as string;
  const value = obj?.[property];

  if (properties.length === 0) {
    return value;
  } else {
    if (value == null) return undefined;
    return getNestedProperty(value, properties);
  }
};

export const useForm = <
  ValueTypes extends Record<string, any>,
  ConfigTypes extends Record<
    string,
    ((value: any, allValues: ValueTypes) => string)[]
  >
>(
  InitialValues: ValueTypes,
  ObjectValidations: ConfigTypes
) => {
  const [cargandoSubmit, setCargandoSubmit] = useState<boolean>(false);
  const [formValues, setformValues] = useState(InitialValues);
  const [isFormInvalid, setisFormInvalid] = useState(false);
  const [isSubmited, setisSubmited] = useState(false);
  const [onBlur, setonBlur] = useState(0);

  const errorValues = useMemo<Record<keyof ConfigTypes, string[]>>(() => {
    const entries = Object.entries(ObjectValidations);

    let hayError = false;
    const res = entries.map(([name]) => {
      const errores = ObjectValidations[name]
        .map((validation) => {
          const properties = name.split(".");
          const value = getNestedProperty(formValues, [...properties]);

          const result = validation(value, formValues);

          if (result) {
            hayError = true;
          }

          return result;
        })
        .filter((err) => err !== "");

      setisFormInvalid(hayError);

      return [name, isSubmited ? errores : []];
    });

    return Object.fromEntries(res);
  }, [onBlur, isSubmited]);

  const isFormInvalidSubmit = useCallback(
    (formValues: ValueTypes) => {
      const entries = Object.entries(ObjectValidations);

      const res = entries.some(([name]) => {
        return ObjectValidations[name].some((validation) => {
          const properties = name.split(".");
          const value = getNestedProperty(formValues, [...properties]);

          const result = validation(value, formValues);

          return result !== "";
        });
      });

      return res;
    },
    [onBlur]
  );

  const onResetForm = useCallback(() => {
    setCargandoSubmit(false);
    setformValues(InitialValues);
    setisSubmited(false);
    setonBlur(0);
  }, []);

  const onNewForm = useCallback((newValues: ValueTypes) => {
    setCargandoSubmit(false);
    setformValues(newValues);
    setisSubmited(false);
    setonBlur(0);
  }, []);

  const handleBlur = useCallback(() => {
    setonBlur((prev) => prev + 1);
  }, []);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setformValues((prevValues) => {
      const { name, value } = event.target;
      const properties = name.split(".");
      let updatedValues = { ...prevValues };

      // Función recursiva para manejar la actualización de propiedades anidadas
      const updateNestedProperty = (obj: any, value: any) => {
        let property = properties.shift() as string;

        // Si la propiedad no existe en el objeto, la inicializamos como un objeto vacío

        if (properties.length === 0) {
          obj[property] = value;
        } else {
          updateNestedProperty(obj[property], value);
        }
      };

      updateNestedProperty(updatedValues, value);

      return updatedValues;
    });
  }, []);

  return {
    cargandoSubmit,
    errorValues,
    formValues,
    handleBlur,
    handleChange,
    isFormInvalid,
    isFormInvalidSubmit,
    onNewForm,
    onResetForm,
    setCargandoSubmit,
    setformValues,
    setisSubmited,
  };
};
