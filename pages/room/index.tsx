import styles from "@/styles/Room.module.css";
import TextInput from "@/components/TextInput/TextInput";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { IUser } from "@/utils/types";
import { hasXSSChars } from "@/utils/string";
import Filter from "bad-words";
const filter = new Filter();

export default function Room() {
  const [inputRoomCode, setInputRoomCode] = useState<string>("");
  const [inputUsername, setInputUsername] = useState<string>("");
  const [validation, setValidation] = useState<Validation>({});

  const router = useRouter();
  const searchParams = useSearchParams();
  const isHost = searchParams.get("host") === "true";

  const roomInputLabel = isHost
    ? "Enter a code to create / rejoin a huddle you are hosting"
    : "Enter a valid code to join an existing huddle";

  const showRoomInput = !validation.roomValidated;
  const showUserInput = validation.roomValidated;
  const allowSubmit = validation.validUsername && !!inputUsername;

  useEffect(() => {
    setValidation((prev) => ({
      ...prev,
      validRoom: false,
      roomError: "",
      roomValidated: false,
    }));
  }, [inputRoomCode]);

  useEffect(() => {
    setValidation((prev) => ({
      ...prev,
      validUsername: false,
      usernameError: "",
      usernameValidated: false,
    }));
  }, [inputUsername]);

  const validateRoomCode = async (value: string) => {
    if (hasXSSChars(value)) {
      setValidation((prev) => ({
        ...prev,
        validRoom: false,
        roomError: "Special characters not allowed",
        roomValidated: false,
      }));
      return;
    }
    if (filter.isProfane(value)) {
      setValidation((prev) => ({
        ...prev,
        validRoom: false,
        roomError: "Let's keep it clean 🤓",
        roomValidated: false,
      }));
      return;
    }
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
    if (hasXSSChars(value)) {
      setValidation((prev) => ({
        ...prev,
        validUsername: false,
        usernameError: "Special characters not allowed",
        usernameValidated: false,
      }));
      return;
    }
    if (filter.isProfane(value)) {
      setValidation((prev) => ({
        ...prev,
        validUsername: false,
        usernameError: "Let's keep it clean 🤓",
        usernameValidated: false,
      }));
      return;
    }
    try {
      const res = await fetch(
        `/api/room/validate-user?username=${value}&roomCode=${inputRoomCode}&host=${isHost}`
      ).then((res) => res.json());

      if (res) {
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

  return (
    <main className={styles.main}>
      <form
        className={styles.form}
        onSubmit={(evt) => {
          evt.preventDefault();
          handleSubmit();
        }}
      >
        <h1>{roomInputLabel}</h1>
        {showRoomInput && (
          <>
            <label className={styles.label}>Huddle Code</label>
            <TextInput
              value={inputRoomCode}
              onChange={setInputRoomCode}
              onValidate={validateRoomCode}
              delay={300}
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
        {showUserInput && (
          <>
            <label className={styles.label}>
              In huddle{" "}
              <span style={{ borderBottom: "1px solid", padding: "0 2px" }}>
                {inputRoomCode}
              </span>
              , participants can address me as
            </label>
            <TextInput
              value={inputUsername}
              onChange={setInputUsername}
              onValidate={validateUsername}
              delay={300}
              errorMessage={validation.usernameError}
            />
          </>
        )}
        {showUserInput && (
          <input
            className={styles.submitButton}
            type="submit"
            value="Submit"
            disabled={!allowSubmit}
          />
        )}
      </form>

      <Link tabIndex={-1} className={styles.backButton} href="/">
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
