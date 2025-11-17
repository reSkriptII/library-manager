import { useCallback, useEffect, useRef } from "react";

type millisecond = number;

export function useDebounce(
  fn: (...args: any) => any,
  delay: millisecond,
): () => void {
  const timeoutRef = useRef<number | null>(null);
  const fnRef = useRef(fn);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  return useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        fnRef.current(...args);
      }, delay);
    },
    [delay],
  );
}
