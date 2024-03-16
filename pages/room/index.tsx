import styles from "@/styles/Room.module.css";
import TextInput from "@/components/TextInput";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { IUser } from "@/utils/types";

export default function Room() {
  const [inputRoomCode, setInputRoomCode] = useState<string>("");
  const [inputUsername, setInputUsername] = useState<string>("");
  const [validation, setValidation] = useState<Validation>({});
  const [savedUser, setSavedUser] = useState<UserData>({ username: "" });

  const router = useRouter();
  const searchParams = useSearchParams();
  const isHost = searchParams.get("host") === "true";

  const validateRoomCode = async (value: string) => {
    try {
      const res = await fetch(
        `/api/room/validate?roomCode=${value}&host=${isHost}`
      ).then((res) => res.json());

      if (res) {
        setValidation((prev) => ({
          ...prev,
          validRoom: res.isAvail,
          roomError: res.message,
        }));
      }
    } catch (e) {
      setValidation({ roomError: "Unexpected Error" });
    }
  };

  const validateUsername = async (value: string) => {
    try {
      const res = await fetch(
        `/api/room/validate-user?username=${value}&roomCode=${inputRoomCode}&host=${isHost}`
      ).then((res) => res.json());

      if (res?.isAvail) {
        setValidation((prev) => ({
          ...prev,
          validUsername: res.isAvail,
          usernameValidated: res.isAvail,
          usernameError: res.message,
        }));
      }
    } catch (e) {
      setValidation((prev) => ({ ...prev, usernameError: "Unexpected Error" }));
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`/api/room`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          host: isHost,
          roomCode: inputRoomCode,
          username: inputUsername,
        }),
      }).then((res) => res.json());
      if (res) {
        const { roomCode, username } = res;
        router.push({ pathname: "/room/" + roomCode, query: { username } });
      }
    } catch (e) {}
  };

  const roomInputLabel = isHost
    ? "Please create a new code to generate a room"
    : "Please enter the code of an existing room to join";

  return (
    <main className={styles.main}>
      <h1>{roomInputLabel}</h1>
      <form
        className={styles.form}
        onSubmit={(evt) => {
          evt.preventDefault();
          handleSubmit();
        }}
      >
        {!validation.roomValidated && (
          <>
            <label className={styles.label}>Room Code</label>
            <TextInput
              value={inputRoomCode}
              onChange={setInputRoomCode}
              onValidate={validateRoomCode}
              delay={500}
              errorMessage={validation.roomError}
            />
            <button
              className={styles.submitButton}
              disabled={!validation.validRoom}
              onClick={() =>
                setValidation((prev) => ({ ...prev, roomValidated: true }))
              }
            >
              Next
            </button>
          </>
        )}
        {validation.roomValidated && (
          <>
            <label
              className={styles.label}
            >{`In room ${inputRoomCode}, participants can call me`}</label>
            <TextInput
              value={inputUsername}
              onChange={setInputUsername}
              onValidate={validateUsername}
              delay={500}
              errorMessage={validation.usernameError}
            />
          </>
        )}

        {validation.roomValidated && (
          <input
            className={styles.submitButton}
            type="submit"
            value="Submit"
            disabled={!validation.validUsername}
          />
        )}
      </form>

      <Link className={styles.backButton} href="/">
        Back to Home
      </Link>
    </main>
  );
}
interface UserData extends IUser {
  roomCode?: string;
}

interface Validation {
  validRoom?: boolean;
  roomError?: string;
  roomValidated?: boolean;

  validUsername?: boolean;
  usernameError?: string;
  usernameValidated?: boolean;
}
