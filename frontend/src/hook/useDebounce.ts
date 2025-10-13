import { useCallback, useRef } from "react";

type millisecond = number;

export function useDebounce(
  fn: (...args: any) => any,
  delay: millisecond,
): () => void {
  const timeoutRef = useRef<number | null>(null);

  return useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        fn(...args);
      });
    },
    [delay],
  );
}
