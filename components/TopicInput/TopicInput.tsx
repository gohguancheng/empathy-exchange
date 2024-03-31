import TextInput from "@/components/TextInput/TextInput";
import { useEffect, useState } from "react";
import Filter from "bad-words";
import { EStage, IUserData } from "@/utils/types";

const filter = new Filter();

export const TopicInput = ({
  currentUser,
  onSubmit,
  setStage,
}: TopicInputProps) => {
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
  }, []);

  const renderOptions = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "4px",
        margin: "8px 0",
      }}
    >
      {[
        "Family Issues",
        "Romantic Trouble",
        "Academic Challenges",
        "Career Dilemma",
      ].map((e, i) => (
        <button
          key={i}
          disabled={!!currentUser?.topic}
          onClick={() => setInput(e)}
        >
          {e}{" "}
        </button>
      ))}
    </div>
  );

  return (
    <div>
      <h3>{label}</h3>
      {renderOptions()}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setStatus({ submitted: true });
          onSubmit(input);
        }}
      >
        <TextInput
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

      {!!currentUser?.host && (
        <button
          onClick={() => setStage(EStage.ROLE_SELECT)}
          disabled={!currentUser.topic}
        >
          To Role Selection
        </button>
      )}
    </div>
  );
};

type TopicInputProps = {
  currentUser?: IUserData;
  onSubmit: (t: string) => void;
  setStage: (s: EStage) => void;
};
