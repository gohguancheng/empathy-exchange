import styles from "@/styles/Start.module.css";
import Link from "next/link";

export default function StartPage() {
  return (
    <main className={`${styles.main} slide-fade`}>
      <div className={styles.topbar}>
        <Link href="/">Empathy Exchange</Link>
      </div>
      <div className={styles.container}>
        <h1>
          Who would you like to
          <br />
          participate as?
        </h1>
        <div className={styles.linkContainer}>
          <Link href="/room?host=true">
            <h3>Host</h3>
            <p>
              Create a new Space and invite your friends to join access your
              Space using this passcode
            </p>
          </Link>
          <Link href="/room">
            <h3>Peer</h3>
            <p>Join a Space using a passcode given by your host</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
