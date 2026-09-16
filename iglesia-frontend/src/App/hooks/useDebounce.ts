import { useCallback, useRef } from "react";

export const useDebouncedCallback = <A extends any[]>(
  callback: (...args: A) => void
) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const timerId = useRef<number | null>(null);

  return useCallback(
    (...args: A) => {
      if (timerId.current) {
        clearTimeout(timerId.current);
      }

      timerId.current = window.setTimeout(() => {
        callbackRef.current(...args);
      }, 500);
    },
    [500]
  );
};
