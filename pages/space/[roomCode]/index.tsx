import { DynamicBackground } from "@/components/DynamicBackground/DynamicBackground";
import styles from "./../../../styles/SpaceCode.module.css";
import React from "react";
import SocketStateProvider from "@/provider/SocketProvider/SocketProvider";
import { MainSpaceLayout } from "@/components/MainSpaceLayout/MainSpaceLayout";
import CenterContainer from "@/components/MainSpaceLayout/CenterContainer";

export default function Space() {
  return (
    <main className={styles.main}>
      <SocketStateProvider>
        <DynamicBackground>
          <CenterContainer>
            <MainSpaceLayout />
          </CenterContainer>
        </DynamicBackground>
      </SocketStateProvider>
    </main>
  );
}
