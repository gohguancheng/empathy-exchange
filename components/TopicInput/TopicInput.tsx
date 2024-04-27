import TextInput from "@/components/TextInput/TextInput";
import { useContext, useEffect, useState } from "react";
import styles from "@/styles/TopicInput.module.css";
import { SocketStateContext } from "@/provider/SocketProvider/SocketProvider";
import { GridButtonsContainer } from "../GridButtonsContainer/GridButtonsContainer";
import clsx from "clsx";

export const TopicInput = () => {
  const { me, setTopic } = useContext(SocketStateContext);

  const [input, setInput] = useState("");
  const [status, setStatus] = useState<{ submitted?: boolean; error?: string }>(
    {}
  );

  useEffect(() => {
    if (!!me?.topic) {
      setInput(me.topic);
    }
    setStatus({ submitted: !!me?.topic });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me]);

  const renderOptions = () => (
    <GridButtonsContainer>
      {[
        "Family Issues",
        "Romantic Troubles",
        "Academic Challenges",
        "Career Dilemma",
        "Financial Stress",
        "Identity and Self Esteem",
      ].map((e, i) => (
        <button
          key={i}
          disabled={!!me?.topic}
          className={clsx(styles.optionButton, {
            [styles.selected]: input === e,
          })}
          onClick={() => setInput(e)}
        >
          {e}
        </button>
      ))}
    </GridButtonsContainer>
  );

  return (
    <div key={`${me?.topic}`} className={`${styles.container} slide-fade`}>
      {!status.submitted ? (
        <>
          <h3>What would you like to share with the Space about?</h3>

          {renderOptions()}

          <form
            className={styles.form}
            onSubmit={(e) => {
              e.preventDefault();
              setStatus({ submitted: true });
              setTopic(input);
            }}
          >
            <TextInput
              label="Sharing Topic"
              placeholder="Enter a topic"
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
        </>
      ) : (
        <>
          <div className={styles.submittedContainer}>
            <h3>You will be discussing</h3>
            <p className={styles.emphasize}>{me?.topic}</p>
            <button onClick={() => setTopic("")} className={styles.reset}>
              Reset Sharing Topic
            </button>
          </div>
        </>
      )}
    </div>
  );
};
