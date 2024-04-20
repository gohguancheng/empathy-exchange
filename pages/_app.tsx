import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Comfortaa } from "next/font/google";

const comfortaa = Comfortaa({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${comfortaa.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}
