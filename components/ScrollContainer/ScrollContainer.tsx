import { ReactNode, useState } from "react";
import styles from "@/styles/utilities/ScrollContainer.module.css";

export const ScrollContainer = ({ children }: { children: ReactNode }) => {
  const [] = useState();

  return (
    <div className={styles.container} onScroll={(e) => console.log(e)}>
      <div className={styles.overflowContainer}>{children}</div>
      <div />
    </div>
  );
};
