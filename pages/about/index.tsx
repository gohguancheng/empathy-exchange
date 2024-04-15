import Accordion from "@/components/Accordion/Accordion";
import styles from "@/styles/About.module.css";
import Link from "next/link";
import { useCallback } from "react";

export default function AboutPage() {
  const renderTitle = useCallback(
    (header: string, subheader: string) => (
      <div className={styles.titleComponent}>
        <h1>
          {header}
          <span>{subheader}</span>
        </h1>
      </div>
    ),
    []
  );

  const renderBody = useCallback(
    (lines: string[]) => (
      <div className={styles.bodyComponent}>
        {lines.map((l, i) => (
          <p key={i}>{l}</p>
        ))}
      </div>
    ),
    []
  );

  return (
    <main className={`${styles.main} slide-fade no-scrollbar`}>
      <div className={styles.container}>
        <div className={styles.topbar}>
          <Link href="/">Empathy Exchange</Link>
        </div>

        <div className={styles.accordionContainer}>
          <Accordion
            titleComponent={renderTitle("what", "is this")}
            bodyComponent={renderBody([
              "Though technology cannot replace the comfort of feeling emotionally supported and listened to by those around us, we believe it can be used to aid us in having healthy discussions and to seek support from those around us.",
              "Empathy Exchange is a simple tool to aid users in providing emotional support to their peers while engaging in meaningful sharing and reflection on difficult topics.",
            ])}
          />
          <Accordion
            titleComponent={renderTitle("Who", "should use this app")}
            bodyComponent={renderBody([
              "Anyone who wishes to improve their listening and conversation skills",
              "Ideal for small teams or friend groups who are doing a regular catch up",
              "Group sizes are limited to 5 pax to ensure all participants get sufficient time for sharing and conversing.",
            ])}
          />
          <Accordion
            titleComponent={renderTitle("How", "do we start")}
            bodyComponent={renderBody([
              "Gather in groups of up to 5. Each group should select a Guide who will think of a unique code to create a Space with. Other participants can join the huddle as Peers with this code.",
              "Participants in the Space will enter a Name to be identified by and a prompt of the Topic that they will be sharing about.",
              "Participants will also select a listener Role to learn and practise different ways of listening in a converation.",
            ])}
          />
        </div>

        <Link href="/start">Start</Link>
      </div>
    </main>
  );
}
