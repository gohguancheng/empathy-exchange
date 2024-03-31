import styles from "@/styles/Room.module.css";
import TextInput from "@/components/TextInput/TextInput";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Room() {
  const [codeInput, setCodeInput] = useState<{
    value: string;
    isValid?: boolean;
    error?: string;
  }>({ value: "" });
  const [userInput, setUserInput] = useState<{
    value: string;
    isValid?: boolean;
    error?: string;
  }>({ value: "" });
  const [showUserInput, setShowUserInput] = useState<boolean>();

  const router = useRouter();
  const searchParams = useSearchParams();
  const isHost = searchParams.get("host") === "true";

  const roomInputLabel = isHost
    ? "Enter a code to create / rejoin a huddle you are hosting"
    : "Enter a valid code to join an existing huddle";

  const showCodeInput = !showUserInput;
  const allowSubmit = codeInput.isValid && !!userInput.isValid;

  const validateRoomCode = async (value: string) => {
    if (!value) return;
    try {
      const res = await fetch(
        `/api/room/validate?roomCode=${value}&host=${isHost}`
      ).then((res) => res.json());

      if (res) {
        setCodeInput((prev) => ({
          ...prev,
          isValid: res.isAvail,
          error: res.message,
        }));
      }
    } catch (e) {
      setCodeInput((prev) => ({
        ...prev,
        isValid: false,
        roomError: "Unexpected Error",
      }));
    }
  };

  const validateUsername = async (value: string) => {
    if (!value) return;
    try {
      const res = await fetch(
        `/api/room/validate-user?username=${value}&roomCode=${codeInput.value}&host=${isHost}`
      ).then((res) => res.json());

      if (res) {
        setUserInput((prev) => ({
          ...prev,
          isValid: res.isAvail,
          error: res.message,
        }));
      }
    } catch (e) {
      setUserInput((prev) => ({ ...prev, usernameError: "Unexpected Error" }));
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
          roomCode: codeInput.value,
          username: userInput.value,
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
        {showCodeInput && (
          <>
            <label className={styles.label}>Huddle Code</label>
            <TextInput
              value={codeInput.value}
              onChange={(value) =>
                setCodeInput(() => ({ value, isValid: false, error: "" }))
              }
              onValidate={validateRoomCode}
              delay={300}
              errorMessage={codeInput.error}
            />
            <button
              className={styles.submitButton}
              disabled={!codeInput.isValid}
              onClick={() => setShowUserInput(true)}
            >
              Next
            </button>
          </>
        )}
        {showUserInput && (
          <>
            <label className={styles.label}>
              Participants in{" "}
              <span style={{ borderBottom: "1px solid", padding: "0 2px" }}>
                {codeInput.value}
              </span>{" "}
              can address me as
            </label>
            <TextInput
              value={userInput.value}
              onChange={(value) =>
                setUserInput({ value, isValid: false, error: "" })
              }
              onValidate={validateUsername}
              delay={300}
              errorMessage={userInput.error}
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

interface Validation {
  validRoom?: boolean;
  roomError?: string;
  roomValidated?: boolean;

  validUsername?: boolean;
  usernameError?: string;
  usernameValidated?: boolean;
}
