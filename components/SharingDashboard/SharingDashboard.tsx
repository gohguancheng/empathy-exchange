import styles from "@/styles/SharingDashboard.module.css";
import { roles, speakerRole } from "@/lib/roles";
import { useContext, useEffect, useMemo, useState } from "react";
import { SocketStateContext } from "@/provider/SocketProvider/SocketProvider";
import { FadeCarousel } from "@/components/FadeCarousel/FadeCarousel";
import { ModalContainer } from "@/components/ModalContainer/ModalContainer";
import clsx from "clsx";
import { IUser } from "@/lib/user";

export const SharingDashboard = () => {
  const [showModal, setShowModal] = useState(false);

  const { me, users, currentSpeaker, setSpeaker, setDone } =
    useContext(SocketStateContext);
  const index = users?.findIndex((u) => u.name === currentSpeaker) ?? -1;
  const speakerDetails = (
    users && index !== -1 ? { ...users[index], index } : {}
  ) as IUser;

  const isSpeaker = me?.name === currentSpeaker;
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

  useEffect(() => {
    if (isSpeaker) {
      setDone();
    }
  }, [isSpeaker, setDone]);

  return (
    <section className={styles.container}>
      <div className={styles.spotlight}>
        <div>
          <p>Speaker:</p>
          <p>{speakerDetails.name}</p>
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

      {!me?.n && (
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
                  key={`${u.name}-${u.done}-${u.clientId}`}
                  disabled={
                    !u.clientId ||
                    (i !== 0 && !!u.done) ||
                    u.name === currentSpeaker
                  }
                  onClick={() => setSpeaker(u.name)}
                  className={clsx({ [styles.done]: u.done })}
                >
                  {u.name}
                </button>
              ))}
            </div>
          </div>
        </ModalContainer>
      }
    </section>
  );
};
