import styles from "@/styles/Home.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <main className={`${styles.main} `}>
      <div className={`${styles.centerContainer} slide-fade`}>
        <div className={styles.titleContainer}>
          <h1>Empathy Exchange</h1>
          <p>Leveling up your empathy</p>
          <p>one conversation at a time</p>
        </div>
        
        <div className={styles.linkContainer}>
          <Link href={"/about"}>Learn More</Link>
          <Link href={"/start"}>Start</Link>
        </div>
      </div>
    </main>
  );
}
