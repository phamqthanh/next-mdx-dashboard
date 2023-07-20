import { Dispatch, SetStateAction, useCallback, useRef, useState } from "react";

interface UseBooleanOutput {
  value: boolean;
  setValue: Dispatch<SetStateAction<boolean>>;
  setTrue: () => void;
  setFalse: () => void;
  toggle: () => void;
}

function useBoolean(defaultValue?: boolean): UseBooleanOutput {
  const [value, setValue] = useState(!!defaultValue);
  const ref = useRef({
    setTrue: () => {},
    setFalse: () => {},
    toggle: () => {},
    setValue,
    value,
  }).current;

  ref.setTrue = useCallback(() => setValue(true), []);
  ref.setFalse = useCallback(() => setValue(false), []);
  ref.toggle = useCallback(() => setValue((x) => !x), []);

  ref.value = value;

  return ref;
}

export default useBoolean;
