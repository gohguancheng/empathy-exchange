import { roles } from "@/lib/roles";
import { IUserData, EStage, ERoles } from "@/utils/types";
import { ReactNode, useState } from "react";

export const SelectRole = ({
  currentUser,
  onSelect,
  setStage,
}: SelectRoleProps) => {
  const [selection, setSelection] = useState(ERoles.EMPATHISER);
  const roleKeys = Object.values(ERoles);
  const chosenRole = roles[selection];
  const hasConfirmed = !!currentUser?.role;

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
          {roleKeys.map((k: ERoles) => {
            return (
              <button
                onClick={() => setSelection(k)}
                style={{ backgroundColor: hasConfirmed ? "black" : "gray" }}
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
        {!!currentUser?.host && (
          <button
            onClick={() => setStage(EStage.SHARING)}
            disabled={!currentUser.role}
          >
            START
          </button>
        )}
      </div>
    )
  );
};

type SelectRoleProps = {
  currentUser?: IUserData;
  onSelect: (t: string) => void;
  setStage: (s: EStage) => void;
};
