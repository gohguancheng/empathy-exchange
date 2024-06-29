import styles from "@/styles/WaitingRoom.module.css";
import { Card } from "../Card/Card";
import { ParticipantsCounter } from "../ParticipantsCounter/ParticipantsCounter";
import { useCallback, useContext } from "react";
import { SocketStateContext } from "@/provider/SocketProvider/SocketProvider";

export const WaitingRoom = () => {
  const { me, users } = useContext(SocketStateContext);

  const isMe = useCallback(
    (user: string) => {
      return !!user && !!me?.name && me.name === user;
    },
    [me]
  );

  const renderUsers = useCallback(
    () => (
      <div className={styles.userContainer}>
        {users?.map((u, i) => (
          <Card
            key={u.name}
            name={u.name}
            highlight={isMe(u.name)}
            isHost={me?.n === 0}
            isOnline={!!u.clientId}
            index={i}
          />
        )) ?? "No users found"}
      </div>
    ),
    [users, isMe, me?.n]
  );

  return (
    <div className={styles.container}>
      <ParticipantsCounter users={users} />
      {renderUsers()}
    </div>
  );
};
