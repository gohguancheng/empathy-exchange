import { ReactElement, ReactNode } from "react";
import { createPortal } from "react-dom";
import styles from "@/styles/utilities/ModalContainer.module.css";

export const ModalContainer = ({
  show,
  children,
  close,
}: Props): ReactElement => {
  const ModalWrapper = ({ children: content }: { children: ReactNode }) => {
    return (
      <div
        className={styles.container}
        onClick={(evt) => {
          evt.stopPropagation();
          close();
        }}
      >
        <div className={styles.whiteContainer}>
          <div
            onClick={(evt) => {
              evt.stopPropagation();
              close();
            }}
            className={styles.closeButtonContainer}
          >
            <button>X</button>
          </div>
          <div className={styles.contentContainer}>{content}</div>
        </div>
      </div>
    );
  };
  return (
    <>
      {show &&
        createPortal(<ModalWrapper>{children}</ModalWrapper>, document.body)}
    </>
  );
};

type Props = {
  show: boolean;
  children?: ReactNode;
  close: () => void;
};
