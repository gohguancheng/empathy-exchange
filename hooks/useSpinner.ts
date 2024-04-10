import { useEffect, useState } from "react";

export default function useSpinnerDelay({ show = true, delay = 2000 }) {
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    if (!show) {
      let timeout = setTimeout(() => setShowSpinner(false), delay);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [show]);

  return { showSpinner };
}
