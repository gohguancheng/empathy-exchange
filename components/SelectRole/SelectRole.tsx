import { roles } from "@/lib/roles";
import { ERole } from "@/utils/types";
import { ReactNode, useCallback, useContext, useMemo, useState } from "react";
import styles from "@/styles/SelectRole.module.css";
import { GridButtonsContainer } from "../GridButtonsContainer/GridButtonsContainer";
import { SocketStateContext } from "@/provider/SocketProvider/SocketProvider";
import { ScrollContainer } from "../ScrollContainer/ScrollContainer";

export const SelectRole = () => {
  const { setRole, me } = useContext(SocketStateContext);
  const [selection, setSelection] = useState(ERole.EMPATHISER);
  const roleKeys = Object.values(ERole);
  const selectedRole = useMemo(() => roles[selection], [selection]);
  const chosenRole = useMemo(
    () => (me?.role ? roles[me.role] : ""),
    [me?.role]
  );

  const renderDescription = useCallback((): ReactNode => {
    return (
      <div className={styles.description}>
        <h4>
          As <span className={styles.large}>{selectedRole.label}</span>,
        </h4>

        <ScrollContainer key={selectedRole.label}>
          {selectedRole.description.map((l, i) => (
            <p
              key={`${selectedRole.label} - ${i}`}
              className={styles.instruction}
            >
              - {l}
            </p>
          ))}
        </ScrollContainer>
      </div>
    );
  }, [selectedRole]);

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
            <h3>You have chosen the role of {chosenRole.label}</h3>
            <h4>To be a great listener</h4>
            <div className={styles.description}>
              <ScrollContainer>
                {selectedRole.description.map((l, i) => (
                  <p
                    key={`${selectedRole.label} - ${i}`}
                    className={styles.instruction}
                  >
                    - {l}
                  </p>
                ))}
              </ScrollContainer>
            </div>
            <button
              onClick={() => {
                setRole("");
                setSelection(me?.role || ERole.EMPATHISER);
              }}
            >
              Choose a different Role
            </button>
          </>
        )}
      </div>
    )
  );
};
