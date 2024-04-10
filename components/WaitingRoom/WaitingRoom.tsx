import { IUserData } from "@/utils/types";
import styles from "@/styles/WaitingRoom.module.css";
import { Card } from "../Card/Card";
import { ParticipantsCounter } from "../ParticipantsCounter/ParticipantsCounter";

export const WaitingRoom = (props: WaitRoomProps) => {
  const { currentUser, users } = props;

  const isMe = (user: string) => {
    return !!user && !!currentUser?.username && currentUser.username === user;
  };

  const renderUsers = () => (
    <div className={styles.userContainer}>
      {users?.map((u, i) => (
        <Card
          key={u.username}
          name={u.username}
          highlight={isMe(u.username)}
          isHost={u.host}
          isOnline={!!u.online}
          index={i}
        />
      )) ?? "No users found"}
    </div>
  );

  return (
    <div className={styles.container}>
      <ParticipantsCounter users={users} />
      {renderUsers()}
      <div className={styles.legend}>
        <span>😎 You</span>
        <span>🧭 Host</span>
      </div>
    </div>
  );
};

type WaitRoomProps = {
  roomCode: string;
  currentUser?: IUserData;
  users?: IUserData[];
};
