import { useEffect } from "react";

export default function Spinner({ size = 60, speed = 1.5, color = "white" }) {
  useEffect(() => {
    async function getLoader() {
      const { trio } = await import("ldrs");
      trio.register();
    }
    getLoader();
  }, []);

  return <l-trio size={size} speed={speed} color={color}></l-trio>;
}

type LoaderProps = {
  size?: number;
  speed?: number;
  color?: string;
};
