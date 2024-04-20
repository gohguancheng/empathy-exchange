import { ReactNode } from "react";
import styles from "@/styles/utilities/GridButtonsContainer.module.css";

export const GridButtonsContainer = ({ children }: { children: ReactNode }) => (
  <div className={styles.optionsContainer}>{children}</div>
);
