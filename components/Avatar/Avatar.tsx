import styles from "@/styles/utilities/Avatar.module.css";
import color from "@/styles/utilities/CommonColors.module.css";
import { getInitials } from "@/utils/string";
import clsx from "clsx";
import { useMemo } from "react";

export const Avatar = ({
  name = "U",
  outline = false,
  grayOut = false,
  index = 0,
  online,
}: AvatarProps) => {
  const initials = useMemo(() => {
    return getInitials(name);
  }, [name]);

  return (
    <div
      className={clsx(styles.avatar, {
        [color.grayOut]: grayOut,
        [styles.outline]: outline,
        [color.user1]: !grayOut && index === 0,
        [color.user2]: !grayOut && index === 1,
        [color.user3]: !grayOut && index === 2,
        [color.user4]: !grayOut && index === 3,
        [color.user5]: !grayOut && index === 4,
      })}
    >
      {initials}
      {typeof online === "boolean" && (
        <div
          className={clsx(styles.indicator, { [styles.dotGreen]: online })}
        />
      )}
    </div>
  );
};

type AvatarProps = {
  name: string;
  index: number;
  grayOut?: boolean;
  outline?: boolean;
  online?: boolean;
};
