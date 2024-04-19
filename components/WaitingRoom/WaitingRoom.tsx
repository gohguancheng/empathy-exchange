import styles from "@/styles/WaitingRoom.module.css";
import { Card } from "../Card/Card";
import { ParticipantsCounter } from "../ParticipantsCounter/ParticipantsCounter";
import { useCallback, useContext } from "react";
import { SocketStateContext } from "@/provider/SocketProvider/SocketProvider";

export const WaitingRoom = () => {
  const { me, users } = useContext(SocketStateContext);

  const isMe = useCallback(
    (user: string) => {
      return !!user && !!me?.username && me.username === user;
    },
    [me]
  );

  const renderUsers = useCallback(
    () => (
      <div className={styles.userContainer}>
        {users?.map((u, i) => (
          <Card
            key={u.username}
            name={u.username}
            highlight={isMe(u.username)}
            isHost={i === 0}
            isOnline={!!u.online}
            index={i}
          />
        )) ?? "No users found"}
      </div>
    ),
    [users, isMe]
  );

  return (
    <div className={styles.container}>
      <ParticipantsCounter users={users} />
      {renderUsers()}
    </div>
  );
};
