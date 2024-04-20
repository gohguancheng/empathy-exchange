import { roles } from "@/lib/roles";
import {  ERole } from "@/utils/types";
import { ReactNode, useContext, useMemo, useState } from "react";
import styles from "@/styles/SelectRole.module.css";
import { GridButtonsContainer } from "../GridButtonsContainer/GridButtonsContainer";
import { SocketStateContext } from "@/provider/SocketProvider/SocketProvider";

export const SelectRole = () => {
  const { setRole, me } = useContext(SocketStateContext);
  const [selection, setSelection] = useState(ERole.EMPATHISER);
  const roleKeys = Object.values(ERole);
  const selectedRole = useMemo(() => roles[selection], [selection]);
  const chosenRole = useMemo(
    () => (me?.role ? roles[me.role] : ""),
    [me?.role]
  );

  const renderDescription = (): ReactNode => {
    return (
      <div className={styles.description}>
        <div>
          <p>
            As <span className={styles.large}>{selectedRole.label}</span>,
          </p>
          {selectedRole.description.map((l, i) => (
            <p key={`${selectedRole.label} - ${i}`}>- {l}</p>
          ))}
        </div>
      </div>
    );
  };

  return (
    selectedRole && (
      <div className={styles.container}>
        {!chosenRole ? (
          <>
            <h3>Select a listener Role</h3>

            <GridButtonsContainer>
              {roleKeys.map((k: ERole) => {
                return (
                  <button key={k} onClick={() => setSelection(k)}>
                    {roles[k]?.label}
                  </button>
                );
              })}
            </GridButtonsContainer>

            {renderDescription()}

            <button onClick={() => setRole(selection)}>Confirm</button>
          </>
        ) : (
          <>
            <h3>You will be listening as an {chosenRole.label}</h3>
<div></div>
            <button onClick={() => setRole("")}>Change Role</button>
          </>
        )}
      </div>
    )
  );
};
