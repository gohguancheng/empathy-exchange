import styles from "@/styles/Home.module.css";
import Link from "next/link";
import { ReactElement, ReactNode, useState } from "react";

export default function Home() {
  const [order, setOrder] = useState<number>(0);
  const TextBody = ({
    children,
  }: {
    children: ReactNode | ReactElement;
  }): ReactElement => <div className={styles.textContainer}>{children}</div>;

  const renderBody = () => {
    switch (order) {
      case 0:
        return (
          <TextBody>
            <h3>
              Please note that this app is meant to support{" "}
              <span style={{ textDecoration: "underline" }}>in-person</span>{" "}
              huddles / sharing
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
              All users participate by talking about a topic that has been on
              their mind
            </p>
            <p>
              Hosts can create a huddle that hosts up to 5 pax. There is only 1
              host per huddle. The host sets the tone for the huddle by being
              the first sharer and controls the flow of the huddle session
            </p>
          </TextBody>
        );
      case 2:
        return (
          <TextBody>
            <h3>What would you like to join as?</h3>
            <p style={{ margin: "8px 0" }}>
              Participant: join an huddle via a code given by your host
            </p>
            <p style={{}}>
              Host: create a new huddle session and invite your friends to join
              via the huddle code
            </p>
            <div className={styles.container}>
              <Link
                className={styles.button}
                href={{ pathname: "room", query: { host: "true" } }}
              >
                Host
              </Link>
              <Link className={styles.button} href={{ pathname: "room" }}>
                Participant
              </Link>
            </div>
          </TextBody>
        );
    }
  };

  return (
    <main className={styles.main}>
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
