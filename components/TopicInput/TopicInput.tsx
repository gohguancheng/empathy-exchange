import TextInput from "@/components/TextInput/TextInput";
import { useState } from "react";
import Filter from "bad-words";
import { EStage, IUserData } from "@/utils/types";
import { hasXSSChars } from "@/utils/string";

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

  return (
    <div>
      <h3>Topic</h3>
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
            if (hasXSSChars(value)) {
              setStatus({ error: "Invalid characters" });
            }
            if (value && value.length < 5) {
              setStatus({ error: "Let's share a little more" });
            }
            if (filter.isProfane(value)) {
              setStatus({ error: "Let's keep it clean 🤓" });
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
