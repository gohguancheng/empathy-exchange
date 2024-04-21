import { ReactNode, useEffect, useRef, useState } from "react";
import styles from "@/styles/utilities/ScrollContainer.module.css";

export const ScrollContainer = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const timeRef = useRef<NodeJS.Timeout>();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleContainerSize = () => {
      const el = ref.current;
      if (el) {
        setShow(el.scrollHeight - el.offsetHeight > 10);
      }
    };
    handleContainerSize();

    window.addEventListener("resize", handleContainerSize);

    return () => {
      if (timeRef.current) clearTimeout(timeRef.current);
      window.removeEventListener("resize", handleContainerSize);
    };
  }, []);

  const handleScroll = () => {
    if (timeRef.current) {
      clearTimeout(timeRef.current);
    }

    const timeout = setTimeout(() => {
      const el = ref.current;
      if (el) setShow(el.scrollHeight - (el.offsetHeight + el.scrollTop) > 10);
    }, 300);

    timeRef.current = timeout;
  };

  return (
    <div className={styles.container}>
      <div ref={ref} className={styles.scrollContainer} onScroll={handleScroll}>
        <div className={styles.overflowContainer}>{children}</div>
      </div>
      {show && <div className={styles.arrow}>⬇️</div>}
    </div>
  );
};
