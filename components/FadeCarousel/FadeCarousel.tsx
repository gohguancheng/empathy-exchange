import { memo, useCallback, useEffect, useRef, useState } from "react";
import styles from "@/styles/utilities/FadeCarousel.module.css";
import clsx from "clsx";

const FadeCarouselRaw = ({ list }: Props) => {
  const [index, setIndex] = useState(0);
  const time = useRef<NodeJS.Timeout>();

  const updateIndex = useCallback(() => {
    clearTimeout(time.current);
    const timeout = setTimeout(() => {
      setIndex((prev) => (prev === list.length - 1 ? 0 : prev + 1));
    }, 8000);
    time.current = timeout;
    return timeout;
  }, [list.length]);

  useEffect(() => {
    updateIndex();

    return () => {
      clearTimeout(time.current);
      time.current = undefined;
    };
  }, [index, updateIndex]);

  return (
    <div className={styles.container}>
      <div>
        <div
          className={clsx(styles.square, { [styles.altBg]: index % 2 !== 0 })}
        >
          {list.map((str, i) => (
            <p
              key={i}
              onTouchStart={() => clearTimeout(time.current)}
              onTouchEnd={() => updateIndex()}
              onMouseEnter={() => clearTimeout(time.current)}
              onMouseLeave={() => updateIndex()}
              className={clsx("fade", { [styles.hide]: index !== i })}
            >
              {str}
            </p>
          ))}
        </div>
      </div>

      <div className={styles.buttonsContainer}>
        <div
          className={clsx(styles.iconLeft, { [styles.invisible]: index === 0 })}
          onClick={() => {
            if (index === 0) return;
            clearTimeout(time.current);
            setIndex((p) => p - 1);
          }}
        ></div>
        <div
          className={clsx(styles.iconRight, {
            [styles.invisible]: index === list.length - 1,
          })}
          onClick={() => {
            if (index === list.length - 1) return;
            clearTimeout(time.current);
            setIndex((p) => p + 1);
          }}
        ></div>
      </div>
    </div>
  );
};

type Props = {
  list: string[];
};

export const FadeCarousel = memo(FadeCarouselRaw);
