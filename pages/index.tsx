import styles from "@/styles/Home.module.css";
import TextInput from "@/components/TextInput";
import { useState } from "react";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [disableSubmit, setDisableSubmit] = useState(true);

  const onValidate = (val: string) => {
    if (val) {
      console.log("validate:", val); // sends via websocket to verify name availability
      setDisableSubmit(false);
    }
  };

  const onChange = (val: string) => {
    setDisableSubmit(true);
    setInputValue(val);
  };

  return (
    <main className={styles.main}>
      <h1>Please select a name for your room</h1>
      <form
        className={styles.form}
        onSubmit={(evt) => {
          evt.preventDefault();
          console.log("submit:", inputValue);
        }}
      >
        <TextInput
          value={inputValue}
          onChange={onChange}
          onValidate={onValidate}
        />
        <input
          className={styles.submitButton}
          type="submit"
          value="Submit"
          disabled={disableSubmit}
        />
      </form>
    </main>
  );
}