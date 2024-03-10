import styles from "@/styles/Home.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>What will you be participating as?</h1>
      <div className={styles.container}>
        <Link className={styles.button} href={{ pathname: "room", query: { host: "true" } }}>Host</Link>
        <Link className={styles.button} href={{ pathname: "room" }}>Participant</Link>
      </div>
    </main>
  );
}
