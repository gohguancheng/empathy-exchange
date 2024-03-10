import styles from "@/styles/Room.module.css";
import TextInput from "@/components/TextInput";
import { useEffect, useState } from "react";
import useSocket from "@/hooks/useSocket";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Room() {
  const [inputRoomCode, setInputRoomCode] = useState<string>("");
  const [inputUsername, setInputUsername] = useState<string>("");

  const {
    joinRoom,
    onValidate,
    errors,
    isValidName,
    isAvailableRoom,
    setUserData,
    userData,
    setIsConnected,
  } = useSocket(inputRoomCode, inputUsername);
  const router = useRouter();
  useEffect(() => {
    setUserData((prev) => ({ ...prev, host: router.query.host === "true" }));
  }, [router.query.host]);

  useEffect(() => {
    setIsConnected(true);
  });

  const roomInputLabel = userData.host
    ? "Please create a new code to generate a room"
    : "Please enter the code of an existing room to join";

  return (
    <main className={styles.main}>
      <h1>{roomInputLabel}</h1>
      <form
        className={styles.form}
        onSubmit={(evt) => {
          evt.preventDefault();
          joinRoom();
        }}
      >
        <label className={styles.label}>Room Code</label>
        <TextInput
          value={inputRoomCode}
          onChange={setInputRoomCode}
          onValidate={(value) => onValidate(value, "room", userData.host)}
          delay={500}
          errorMessage={errors.roomError}
        />

        <label className={styles.label}>Choose your display name</label>
        <TextInput
          value={inputUsername}
          onChange={setInputUsername}
          onValidate={(value) => onValidate(value, "user")}
          delay={500}
          errorMessage={!!inputUsername ? errors.usernameError : ""}
          disabled={!inputRoomCode}
        />

        <input
          className={styles.submitButton}
          type="submit"
          value="Submit"
          disabled={!(isValidName && isAvailableRoom)}
        />
      </form>

      <Link className={styles.backButton} href="/">
        Back to Home
      </Link>
    </main>
  );
}
