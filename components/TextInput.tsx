import React, { ChangeEvent, useEffect, useState } from "react";
import styles from "./index.module.css";

interface TextInputProps {
  value: string;
  onChange: (v: string) => void;
  delay?: number;
  onValidate?: (v: string) => void;
}

export default function TextInput(props: TextInputProps) {
  const { onChange, value = "", delay = 2000, onValidate } = props;
  const [localValue, setLocalValue] = useState<string>("");
  const [timeoutTracker, setTimeoutTracker] = useState<
    NodeJS.Timeout | undefined
  >();

  useEffect(() => {
    if (value !== localValue) {
      setLocalValue(value);
      handleDelayedValidation(value);
    }
  }, [value]);

  const handleDelayedValidation = (value: string) => {
    if (!onValidate) return;

    if (timeoutTracker) {
      clearTimeout(timeoutTracker);
    }

    const newTimeOut = setTimeout(() => {
      onValidate(value);
      setTimeoutTracker(undefined);
    }, delay);

    setTimeoutTracker(() => newTimeOut);
  };

  const handleOnChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setLocalValue(evt.target.value);
    onChange(evt.target.value);
    handleDelayedValidation(evt.target.value);
  };

  return (
    <input
      className={styles.textInput}
      type="text"
      value={localValue}
      onChange={handleOnChange}
    />
  );
}