import styles from "@/styles/utilities/Chip.module.css";
import clsx from "clsx";
import { useMemo } from "react";

export const Chip = ({
  text = "",
  checked = false,
  grayOut = false,
}: ChipProps) => {
  const initials = useMemo(() => {
    if ([1, 2].includes(text.length)) {
      return text.toUpperCase();
    } else {
      return text
        .replace(/[_-]/g, " ")
        .split(" ")
        .map((str) => str[0].toUpperCase())
        .join("")
        .slice(0, 2);
    }
  }, [text]);
  return (
    <div className={clsx(styles.container, { [styles.grayOut]: grayOut })}>
      <p>{initials}</p>
      <p>{checked ? "✅" : "❌"}</p>
    </div>
  );
};

type ChipProps = { text: string; checked: boolean; grayOut: boolean };
