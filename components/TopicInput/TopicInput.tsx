import TextInput from "@/components/TextInput/TextInput";
import { useEffect, useState } from "react";
import { IUserData } from "@/utils/types";
import styles from "@/styles/TopicInput.module.css";

export const TopicInput = ({ currentUser, onSubmit }: TopicInputProps) => {
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<{ submitted?: boolean; error?: string }>(
    {}
  );

  const label = status.submitted
    ? `You will be sharing about "${input}"`
    : "What would you like to share about?";

  useEffect(() => {
    if (!!currentUser?.topic) {
      setInput(currentUser.topic);
      setStatus({ submitted: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderOptions = () => (
    <div className={styles.optionsContainer}>
      {[
        "Family Issues",
        "Romantic Troubles",
        "Academic Challenges",
        "Career Dilemma",
      ].map((e, i) => (
        <button
          key={i}
          disabled={!!currentUser?.topic}
          onClick={() => setInput(e)}
        >
          {e}
        </button>
      ))}
    </div>
  );

  return (
    <div className={styles.container}>
      <h3>{label}</h3>

      {!currentUser?.topic && renderOptions()}

      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          setStatus({ submitted: true });
          onSubmit(input);
        }}
      >
        <TextInput
          label="Topic"
          value={input}
          onChange={(value) => {
            setStatus({});
            setInput(value);
          }}
          onValidate={(value) => {
            if (value && value.length < 5) {
              setStatus({ error: "Let's share a little more" });
            }
          }}
          delay={200}
          disabled={status.submitted}
          errorMessage={status.error}
        />

        <input
          type="submit"
          value="Submit"
          disabled={!input || !!status.error || !!status.submitted}
        />
      </form>
    </div>
  );
};

type TopicInputProps = {
  currentUser?: IUserData;
  onSubmit: (t: string) => void;
};
