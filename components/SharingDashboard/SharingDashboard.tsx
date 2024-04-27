import { IUser } from "@/utils/types";
import styles from "@/styles/SharingDashboard.module.css";
import { roles, speakerRole } from "@/lib/roles";
import { useContext, useMemo, useState } from "react";
import { SocketStateContext } from "@/provider/SocketProvider/SocketProvider";
import { FadeCarousel } from "@/components/FadeCarousel/FadeCarousel";
import { ModalContainer } from "@/components/ModalContainer/ModalContainer";
import clsx from "clsx";

export const SharingDashboard = () => {
  const [showModal, setShowModal] = useState(false);

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

      {!!me?.host && (
        <div className={styles.hostContainer}>
          <button
            className={styles.hostButton}
            onClick={() => setShowModal(true)}
          >
            Select next speaker
          </button>

          <p>Select yourself after the rest have spoken to end session</p>
        </div>
      )}
      {
        <ModalContainer show={showModal} close={() => setShowModal(false)}>
          <div className={styles.modalContent}>
            <h5>Select the next speaker</h5>

            <div className={styles.modalButtonsContainer}>
              {users?.map((u, i) => (
                <button
                  key={`${u.username}-${u.done}-${u.online}`}
                  disabled={
                    (i !== 0 && !!u.done) || u.username === currentSpeaker
                  }
                  onClick={() => setSpeaker(u.username)}
                  className={clsx({ [styles.done]: u.done })}
                >
                  {u.username}
                </button>
              ))}
            </div>
          </div>
        </ModalContainer>
      }
    </section>
  );
};
