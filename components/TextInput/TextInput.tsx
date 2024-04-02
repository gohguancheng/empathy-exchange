import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import styles from "@/styles/utilities/TextInput.module.css";
import { hasXSSChars } from "@/utils/string";
import Filter from "bad-words";
import clsx from "clsx";
const filter = new Filter();

interface TextInputProps {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  delay?: number;
  onValidate?: (v: string) => void;
  errorMessage?: string;
  disabled?: boolean;
  unfilter?: boolean;
  isLight?: boolean;
}

export default function TextInput(props: TextInputProps) {
  const {
    label,
    onChange,
    value = "",
    delay = 2000,
    onValidate,
    errorMessage,
    disabled = false,
    unfilter = false,
    isLight = false,
  } = props;
  const [localValue, setLocalValue] = useState<string>("");
  const [localError, setLocalError] = useState<string>("");
  const timeoutRef = useRef<NodeJS.Timeout | undefined>();
  const hasError = !!(localError || errorMessage);

  const validate = (value: string) => {
    if (hasXSSChars(value)) {
      return setLocalError("Special characters not allowed");
    }

    if (!unfilter && filter.isProfane(value)) {
      return setLocalError("Let's keep it clean 🤓");
    }

    if (onValidate) {
      onValidate(value);
    }
  };

  const handleDelayedValidation = (value: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const newTimeOut = setTimeout(() => {
      validate(value);
      timeoutRef.current = undefined;
    }, delay);

    timeoutRef.current = newTimeOut;
  };

  const handleOnChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setLocalValue(evt.target.value);
    onChange(evt.target.value);
  };

  useEffect(() => {
    setLocalError("");
    if (value !== localValue) {
      setLocalValue(value);
    }
    handleDelayedValidation(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <>
      <div
        className={clsx(styles.container, {
          [styles.error]: hasError,
          [styles.dark]: !hasError && !isLight,
          [styles.light]: !hasError && !!isLight,
        })}
      >
        {!!label && <label>{label}</label>}{" "}
        <input
          type="text"
          value={localValue}
          onChange={handleOnChange}
          disabled={disabled}
        />
      </div>

      <div className={styles.errorMessage}>
        {hasError && <p>{localError || errorMessage}</p>}
      </div>
    </>
  );
}
