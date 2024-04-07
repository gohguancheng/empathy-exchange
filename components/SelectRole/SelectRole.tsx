import { roles } from "@/lib/roles";
import { IUserData, ERole } from "@/utils/types";
import { ReactNode, useEffect, useState } from "react";

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
        {hasConfirmed ? (
          <p>You will be taking part as a {chosenRole.label}</p>
        ) : (
          <p>Click below to confirm your role as a {chosenRole.label}</p>
        )}
        <p>{chosenRole.description}</p>
      </div>
    );
  };

  const renderRoleSelector = (): ReactNode => {
    return (
      <div>
        <div>
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
      </div>
    );
  };

  return (
    chosenRole && (
      <div>
        <h3>Select Role</h3>
        {renderDescription()}
        <div>{renderRoleSelector()}</div>
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
