import { ReactElement, ReactNode, useEffect, useState } from "react";
import styles from "@/styles/utilities/Accordion.module.css";
import clsx from "clsx";

export default function Accordion({
  titleComponent,
  bodyComponent,
  shouldOpen = false,
}: {
  titleComponent: ReactNode | ReactElement;
  bodyComponent: ReactNode | ReactElement;
  shouldOpen?: boolean;
}) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(shouldOpen);
  }, [shouldOpen]);

  return (
    <div className={styles.container}>
      <div
        onClick={() => {
          setOpen((prev) => !prev);
        }}
        className={styles.titleContainer}
      >
        {titleComponent}
        <div
          className={clsx(styles.icon, {
            [styles.minus]: open,
            [styles.plus]: !open,
          })}
        ></div>
      </div>
      <hr
        className={styles.divider}
        style={open ? { borderColor: "transparent" } : {}}
      />
      {
        <div
          className={clsx(styles.bodyContainer, { [styles.expanded]: open })}
        >
          {bodyComponent}
        </div>
      }
    </div>
  );
}
