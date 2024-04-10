import styles from "@/styles/Home.module.css";
import Link from "next/link";
import { ReactElement, ReactNode, useState } from "react";

export default function Home() {
  const [order, setOrder] = useState<number>(0);
  const TextBody = ({
    children,
  }: {
    children: ReactNode | ReactElement;
  }): ReactElement => <div className={`${styles.textContainer} slide-fade`}>{children}</div>;

  const renderBody = () => {
    switch (order) {
      case 0:
        return (
          <TextBody>
            <h3>
              Please note that this app is meant to support{" "}
              <span style={{ textDecoration: "underline" }}>in-person</span>{" "}
              huddles
            </h3>
            <p>
              We strongly encourage users to meet in-person to engage in
              meaningful sharing with the help of this app
            </p>
          </TextBody>
        );
      case 1:
        return (
          <TextBody>
            <h3>Types of participants</h3>
            <p style={{ margin: "16px 0" }}>
              All users participate by talking about a topic that they would like to get off their chest
            </p>
            <p>
              Hosts can create a huddle that hosts up to 5 pax. There will be only 1
              host per huddle. The host sets the tone for the huddle by being
              the first sharer and aid the flow of the huddle session
            </p>
          </TextBody>
        );
      case 2:
        return (
          <TextBody>
            <h3>What would you like to join as?</h3>
            <div className={styles.container}>
              <Link
                className={styles.card}
                href={{ pathname: "room", query: { host: "true" } }}
              >
                <h4>Host</h4>
                <p>
                  Create a new huddle session and invite your friends to join
                  through your huddle code
                </p>
              </Link>
              <Link className={styles.card} href={{ pathname: "room" }}>
                <h4>Participant</h4>{" "}
                <p>Join a huddle using a code given by your host</p>
              </Link>
            </div>
          </TextBody>
        );
    }
  };

  return (
    <main className={`${styles.main} slide-fade`}>
      <h1>Empathy Exchange</h1>

      {renderBody()}

      {order < 2 && (
        <div className={styles.container}>
          {!!order && (
            <button
              className={styles.button}
              onClick={() => setOrder((prev) => (prev === 0 ? 0 : prev - 1))}
            >
              Back
            </button>
          )}

          <button
            className={styles.button}
            onClick={() => setOrder((prev) => (prev > 1 ? 2 : prev + 1))}
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
}
