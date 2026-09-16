import { useCallback, useRef } from "react";

export type KeyboardEvent = React.KeyboardEvent;

export const useFieldProps = <
  Config extends Record<string, ((...args: any[]) => any)[]>
>(props: {
  config: Config;
  formValues: any;
  errorValues: any;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: () => void;
  handleKeyDown: (arg: KeyboardEvent) => void;
}) => {
  type Property = keyof Config;

  const getNestedObject = useCallback((nestedObj: any, pathArr: string[]) => {
    return pathArr.reduce(
      (obj, key) => (obj && obj[key] !== "undefined" ? obj[key] : undefined),
      nestedObj
    );
  }, []);

  // Crear las referencias dinámicamente
  const refs: Record<Property, React.RefObject<HTMLInputElement>> = Object.keys(
    props.config
  ).reduce((acc, key) => {
    acc[key as Property] = useRef<HTMLInputElement | null>(null);
    return acc;
  }, {} as Record<Property, React.RefObject<HTMLInputElement>>);

  const defaultPropsGenerator = useCallback(
    (property?: Property, isRequired = false, hasValue = false) => {
      let baseProps: {
        fullWidth: boolean;
        onKeyDown: (e: KeyboardEvent) => void;
        autoComplete: string;
        name?: Property;
        onBlur: () => void;
        value?: any;
        onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
        error?: boolean;
        helperText?: string;
        inputRef?: React.RefObject<HTMLInputElement>;
      } = {
        fullWidth: true,
        onKeyDown: props.handleKeyDown,
        autoComplete: "false",
        onBlur: props.handleBlur,
        name: property,
        inputRef: refs[property!], // Asignar la referencia correspondiente
      };

      if (isRequired) {
        baseProps = {
          ...baseProps,
          error: props.errorValues[property!].length > 0,
          helperText: props.errorValues[property!].join(" - "),
        };
      }
      if (hasValue) {
        const values = String(property)?.split(".");
        baseProps = {
          ...baseProps,
          value: getNestedObject(props.formValues, values!),
          onChange: props.handleChange,
        };
      }

      return baseProps;
    },
    [props, getNestedObject, refs]
  );

  // Devolver las referencias junto con defaultPropsGenerator
  return { defaultPropsGenerator, refs };
};

// handleNavigation.ts
type ConfigKeys = string; // Reemplaza esto con el tipo correcto para tus claves de configuración
type Refs = Record<ConfigKeys, React.RefObject<HTMLInputElement>>;

export const handleNavigation = (
  e: React.KeyboardEvent,
  config: Record<string, any>,
  refs: Refs
) => {
  const target = e.target as HTMLInputElement & { name: ConfigKeys };
  const keys = Object.keys(config) as ConfigKeys[];
  if (e.shiftKey) {
    if (keys.includes(target.name)) {
      const keyIndex = keys.indexOf(target.name);
      const moveFocus = (step: number) => {
        const newIndex = keyIndex + step;
        if (newIndex >= 0 && newIndex < keys.length) {
          refs[keys[newIndex]].current?.focus();
        }
      };

      if (e.key === "ArrowRight") {
        moveFocus(1);
      }
      if (e.key === "ArrowLeft") {
        moveFocus(-1);
      }
    }
  }
};
