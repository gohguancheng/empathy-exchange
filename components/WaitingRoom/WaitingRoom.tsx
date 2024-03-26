import { EStage, IUserData } from "@/utils/types";
import styles from "@/styles/WaitingRoom.module.css";

export const WaitingRoom = (props: WaitRoomProps) => {
  const { roomCode, currentUser, users, setStage } = props;

  const isMe = (user: string) => {
    return !!user && !!currentUser?.username && currentUser.username === user;
  };

  const onlineUsersCount = () => users?.filter((u) => !!u.online).length ?? 0;

  const renderUsers = () => (
    <div className={styles.userContainer}>
      {users?.map((u) => (
        <div
          key={u.username}
          className={styles.userCard}
          style={isMe(u.username) ? { border: "green 2px solid" } : {}}
        >
          <h5>{u.username}</h5>
          <div className={styles.userIconContainer}>
            {isMe(u.username) && <span>😎</span>}
            {!!u.host && <span>🧭</span>}
            <span>{u.online ? "🟩" : "🟥"}</span>
          </div>
        </div>
      )) ?? "No users found"}
    </div>
  );

  const renderButtons = () => {
    // TODO
  };

  return (
    <div className={styles.container}>
      <h1>
        Huddle {roomCode} waiting for participants [{onlineUsersCount()} / 5]{" "}
      </h1>

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
