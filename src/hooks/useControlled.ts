import { useState } from "react";

type UseControlledState<T> = [T, (value: T | ((prevState: T) => T)) => void];
function useControlled<T>(
  valueProp?: T | undefined,
  defaultValue?: T,
  onChange?: (value: T) => void
): UseControlledState<T> {
  const [valueState, setValueState] = useState<T>(defaultValue as any);

  const value = valueProp !== undefined ? valueProp : valueState;

  const setValue = (newValue: T | ((prevState: T) => T)) => {
    setValueState((v) => {
      let value: T;
      if (typeof newValue === "function") {
        value = (newValue as any)(v);
      } else value = newValue;
      onChange?.(value);
      return value;
    });
  };

  return [value, setValue];
}

export default useControlled;
