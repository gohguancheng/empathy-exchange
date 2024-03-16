import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Room() {
  const router = useRouter();
  const { roomId, username } = router.query;

  useEffect(() => {
    if (!(roomId && username)) router.replace("/");
  }, [roomId, username]);

  return (
    <div>
      Room ID: {roomId} {username}
    </div>
  );
}
