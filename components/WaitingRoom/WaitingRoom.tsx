import { EStage, IUserData } from "@/utils/types";
import styles from "@/styles/WaitingRoom.module.css";
import { Card } from "../Card/Card";
import { ParticipantsCounter } from "../ParticipantsCounter/ParticipantsCounter";

export const WaitingRoom = (props: WaitRoomProps) => {
  const { roomCode, currentUser, users, setStage } = props;

  const isMe = (user: string) => {
    return !!user && !!currentUser?.username && currentUser.username === user;
  };

  const renderUsers = () => (
    <div className={styles.userContainer}>
      {users?.map((u) => (
        <Card
          name={u.username}
          highlight={isMe(u.username)}
          isHost={u.host}
          isOnline={!!u.online}
        />
      )) ?? "No users found"}
    </div>
  );

  const renderButtons = () => {
    // TODO
  };

  return (
    <div className={styles.container}>
      <h1>Huddle {roomCode} waiting for participants</h1>
      <ParticipantsCounter users={users} />
      {renderUsers()}
      <div className={styles.legend}>
        <span>😎 You</span>
        <span>🧭 Host</span>
      </div>
      <div>
        {!!currentUser?.host && (
          <button onClick={() => setStage(EStage.TOPIC_INPUT)}>
            To Topic Selection
          </button>
        )}
      </div>
    </div>
  );
};

type WaitRoomProps = {
  roomCode: string;
  currentUser?: IUserData;
  users?: IUserData[];
  setStage: (s: EStage) => void;
};
