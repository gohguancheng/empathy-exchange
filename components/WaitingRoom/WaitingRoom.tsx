import { EStage, IUserData } from "@/utils/types";
import styles from "@/styles/WaitingRoom.module.css";
import { Card } from "../Card/Card";

export const WaitingRoom = (props: WaitRoomProps) => {
  const { roomCode, currentUser, users, setStage } = props;

  const isMe = (user: string) => {
    return !!user && !!currentUser?.username && currentUser.username === user;
  };

  const onlineUsersCount = () => users?.filter((u) => !!u.online).length ?? 0;

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
      <div>
        <h1>Huddle {roomCode} waiting for participants</h1>
        <h2>
          <span>{onlineUsersCount()}</span>
          <span> / 5</span>
        </h2>
      </div>

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
