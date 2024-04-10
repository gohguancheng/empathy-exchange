import { roles } from "@/lib/roles";
import { IUserData, ERole } from "@/utils/types";
import { ReactNode, useEffect, useState } from "react";
import styles from "@/styles/SelectRole.module.css";

export const SelectRole = ({ currentUser, onSelect }: SelectRoleProps) => {
  const [selection, setSelection] = useState(ERole.EMPATHISER);
  const roleKeys = Object.values(ERole);
  const chosenRole = roles[selection];
  const hasConfirmed = !!currentUser?.role;

  useEffect(() => {
    if (currentUser?.role) {
      setSelection(currentUser.role);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderDescription = (): ReactNode => {
    return (
      <div>
        <div className={styles.description}>
          <div>
            <p>
              As <span className={styles.large}>{chosenRole.label}</span>,
            </p>
            {chosenRole.description.map((l, i) => (
              <p key={`${chosenRole.label} - ${i}`}>- {l}</p>
            ))}
          </div>
        </div>
        {hasConfirmed ? (
          <p className={styles.instruction}>
            You will be taking part as a {chosenRole.label}
          </p>
        ) : (
          <p className={styles.instruction}>
            Click below to confirm your role as a {chosenRole.label}
          </p>
        )}
      </div>
    );
  };

  const renderRoleSelector = (): ReactNode => {
    return (
      <div className={styles.optionsContainer}>
        {roleKeys.map((k: ERole) => {
          return (
            <button
              key={k}
              onClick={() => setSelection(k)}
              disabled={hasConfirmed}
            >
              {roles[k]?.label}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    chosenRole && (
      <div>
        <h3>Select Role</h3>
        <div>{renderRoleSelector()}</div>
        {renderDescription()}
        <button
          onClick={() => onSelect(selection)}
          disabled={!!currentUser?.role}
        >
          Confirm
        </button>
      </div>
    )
  );
};

type SelectRoleProps = {
  currentUser?: IUserData;
  onSelect: (t: string) => void;
};
