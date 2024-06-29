import styles from "@/styles/Space.module.css";
import TextInput from "@/components/TextInput/TextInput";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Space() {
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
        const { roomCode, name: username } = res;
        router.push({ pathname: "/space/" + roomCode, query: { username } });
      }
    } catch (e) {}
  };

  useEffect(() => {
    setCodeInput({ value: "" });
    setUserInput({ value: "" });
    setShowUserInput(false);
  }, [isHost]);

  const renderTopSection = () => {
    if (isHost) {
      return (
        <div className={styles.topSection}>
          <div>Creating a Space</div>
          <Link href="/space">Join a space as Peer instead</Link>
        </div>
      );
    }

    return (
      <div className={styles.topSection}>
        <div>Joining a Space</div>
        <Link href={{ pathname: "/space", query: { host: "true" } }}>
          Host a Space instead
        </Link>
      </div>
    );
  };

  const renderInputLabel = () => {
    if (showUserInput) {
      return <h2>Enter your display name</h2>;
    }

    if (isHost) {
      return <h2>Enter a passcode that Peers will use to access your Space</h2>;
    }

    if (!isHost) {
      return <h2>Enter a passcode given by your Host to access the Space</h2>;
    }
  };

  return (
    <main className={styles.main}>
      <div className="slide-fade">
        {renderTopSection()}

        <form
          className={styles.form}
          onSubmit={(evt) => {
            evt.preventDefault();
            handleSubmit();
          }}
        >
          {renderInputLabel()}
          {showCodeInput && (
            <>
              <TextInput
                label="Space Passcode"
                placeholder={`Enter ${
                  isHost ? "a unique" : "the given"
                } passcode`}
                value={codeInput.value}
                onChange={(value) =>
                  setCodeInput(() => ({ value, isValid: false, error: "" }))
                }
                onValidate={validateRoomCode}
                delay={200}
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
              <TextInput
                label="Display Name"
                placeholder="Use a unique display name"
                value={userInput.value}
                onChange={(value) =>
                  setUserInput({ value, isValid: false, error: "" })
                }
                onValidate={validateUsername}
                delay={200}
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
      </div>
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
