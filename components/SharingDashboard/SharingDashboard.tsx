import { IUser, IUserData } from "@/utils/types";
import styles from "@/styles/SharingDashboard.module.css";
import { roles } from "@/lib/roles";
import { useState } from "react";

export const SharingDashboard = (props: SharingDashboardProps) => {
  const [nextUser, setNextUser] = useState("");

  const { currentUser, users, speaker, onUpdate } = props;
  const index = users?.findIndex((u) => u.username === speaker) ?? -1;
  const speakerDetails = (
    users && index !== -1 ? { ...users[index], index } : {}
  ) as IUser;

  const renderRoleContent = () => {
    const currentRole = !!currentUser.role ? roles[currentUser.role] : roles.e1;
    return (
      <>
        <h3>As {currentRole.label}, </h3>
        <ul className={styles.list}>
          <li>Listen attentively to the speaker</li>
          {currentRole.description.map((line, i) => (
            <li key={`${currentRole.label}-${i}`}>{line}</li>
          ))}
        </ul>
      </>
    );
  };

  const renderUsers = () => {
    if (!users) return <></>;

    return (
      <div className={styles.userContainer}>
        {users?.map((u, i) => (
          <div key={`${u.online}-${i}`}>
            <p>{u.username}</p>
            {!!currentUser.host && (
              <button
                disabled={!!(!!i && (!u.online || !!u.done))}
                onClick={() => setNextUser(u.username)}
              >
                Select
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };

  const handleConfirm = async () => {
    await onUpdate(nextUser);
    setNextUser(() => "");
  };

  return (
    <section className={styles.container}>
      <div className={styles.spotlight}>
        <h3>Current Topic</h3>
        <div>
          <p>{speakerDetails.username}</p>
          <span> sharing about </span>
          <p>"{speakerDetails.topic}"</p>
        </div>
      </div>
      <div className={styles.roleInfo}>{renderRoleContent()}</div>
      {renderUsers()}
      {!!nextUser && (
        <div className={styles.modal}>
          <div>
            <div className={styles.modalContent}>
              <h5>Switch to {nextUser}?</h5>
              <p>Is {speakerDetails.username} done sharing?</p>
              <div className={styles.modalButtons}>
                <button onClick={handleConfirm}>Yes</button>
                <button onClick={() => setNextUser("")}>No</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

type SharingDashboardProps = {
  currentUser: IUserData;
  users?: IUser[];
  speaker?: string;
  onUpdate: (spker: string) => Promise<void>;
};
