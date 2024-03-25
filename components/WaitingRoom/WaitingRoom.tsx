import { EStage, IUserData } from "@/utils/types";

export const WaitingRoom = (props: WaitRoomProps) => {
  const { currentUser, users, setStage } = props;

  const renderUsers = () => (
    <div>
      {users?.map((u) => (
        <div key={u.username}>
          {JSON.stringify({ ...u, me: u.username === currentUser?.username })}
        </div>
      )) ?? "No users found"}
    </div>
  );
  return (
    <div>
      <div>{renderUsers()}</div>
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
  currentUser?: IUserData;
  users?: IUserData[];
  setStage: (s: EStage) => void;
};
