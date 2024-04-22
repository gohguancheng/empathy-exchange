import { IUser } from "@/utils/types";
import styles from "@/styles/SharingDashboard.module.css";
import { roles, speakerRole } from "@/lib/roles";
import { useContext, useMemo, useState } from "react";
import { SocketStateContext } from "@/provider/SocketProvider/SocketProvider";
import { FadeCarousel } from "@/components/FadeCarousel/FadeCarousel";

export const SharingDashboard = () => {
  const [nextUser, setNextUser] = useState("");

  const { me, users, currentSpeaker, setSpeaker } =
    useContext(SocketStateContext);
  const index = users?.findIndex((u) => u.username === currentSpeaker) ?? -1;
  const speakerDetails = (
    users && index !== -1 ? { ...users[index], index } : {}
  ) as IUser;

  const isSpeaker = me?.username === currentSpeaker;
  const currentRole = isSpeaker
    ? speakerRole
    : !!me?.role
    ? roles[me.role]
    : roles.e1;

  const tips = useMemo(
    () => {
      const baseTips = isSpeaker
        ? [
            "Speak openly",
            "Pause where appropriate to allow other to digest your words",
          ]
        : [
            "Listen attentively",
            "Maintain comfortable eye contact with speaker",
          ];

      return [...baseTips, ...currentRole.description];
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentRole.label, isSpeaker]
  );

  const renderUsers = () => {
    if (!users || !me?.host) return <></>;

    return (
      <div>
        <h3 className={styles.selectUserTitle}>Select Next User</h3>
        <p className={styles.selectUserTip}>
          Select yourself as speaker again once you are ready to end the session
        </p>
        <div className={styles.userContainer}>
          {users?.map((u, i) => (
            <button
              key={`${u.online}-${i}`}
              onClick={() => setNextUser(u.username)}
            >
              {u.username}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const handleConfirm = async () => {
    setSpeaker(nextUser);
    setNextUser(() => "");
  };

  return (
    <section className={styles.container}>
      <div className={styles.spotlight}>
        <div>
          <p>Speaker:</p>
          <p>{speakerDetails.username}</p>
          <p>Topic:</p>
          <p>{speakerDetails.topic}</p>
        </div>
      </div>

      <div className={styles.roleInfo}>
        <h3>As {currentRole.label},</h3>
        <div className={styles.tipsContainer}>
          {<FadeCarousel key={currentRole.label} list={tips} />}
        </div>
      </div>

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
