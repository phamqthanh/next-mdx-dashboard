import { debounce } from "@/utilities/debounce";
import { useCallback, useMemo } from "react";

function useDebounced<T extends (...args: any[]) => void>(
  fn: T,
  deps: any[],
  ms: number,
  noFirst?: boolean,
  noLast?: boolean
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fnMemo = useCallback(fn, deps);

  return useMemo(() => {
    return debounce(fnMemo, ms, !noFirst, !noLast);
  }, [fnMemo, ms, noFirst, noLast]);
}

export default useDebounced;
