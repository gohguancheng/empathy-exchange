import { EStage, IRoom, IRooms, IUser } from "@/utils/types";

declare global {
  var serverStore: ServerStore;
}

// const mockRoom: IRoom = {
//   users: [{ username: "h" }, { username: "u1" }],
//   current: { stage: EStage.WAITING },
// };
class ServerStore {
  rooms: IRooms;
  constructor() {
    this.rooms = {};
  }

  getRoom(code: string) {
    return this.rooms[code];
  }

  getRoomUsers(code: string) {
    return this.rooms[code]?.users;
  }

  getUser(code: string, username: string) {
    const rooms = this.getRoomUsers(code);
    const index = rooms?.findIndex((user) => user.username === username) ?? -1;
    let res;
    if (index >= 0) {
      res = rooms[index] as IUser & { host: boolean };
      res.host = index === 0 ? true : false;
    }
    return res;
  }

  isUserHost(code: string, username: string) {
    const rooms = this.getRoomUsers(code);
    return rooms?.findIndex((user) => user.username === username) === 0;
  }

  setUserOnlineState(code: string, username: string, socketId = "") {
    if (!code || !username) return { error: "Invalid paramaters" };

    const users = this.getRoomUsers(code);
    const userIndex = users.findIndex((user) => user.username === username);
    if (userIndex < 0) {
      return { error: "User not found" };
    }

    if (users[userIndex].online === socketId) {
      return { message: "OK, user is already connected" };
    }

    if (users[userIndex].online && socketId) {
      return { error: "User is already online" };
    }

    if (users[userIndex].online && !socketId) {
      users[userIndex].online = undefined;
    }

    if (!users[userIndex].online && socketId) {
      users[userIndex].online = socketId;
    }
    return { message: "OK", user: users[userIndex] };
  }

  setStageForRoom(code: string, newStage: EStage) {
    this.rooms[code].current.stage = newStage;
    if (newStage === EStage.SHARING && !this.getRoom(code)?.current?.speaker) {
      this.setSpeakerForRoom(code, this.getRoomUsers(code)[0].username);
    }
    return this.rooms[code];
  }

  setSpeakerForRoom(code: string, speaker: string) {
    const selected = this.getUser(code, speaker);
    if (selected && selected.online && !selected.done) {
      this.rooms[code].current.speaker = speaker;
      return this.rooms[code];
    }
  }

  setTopicForUser(code: string, username: string, topic: string) {
    const users = this.getRoomUsers(code);
    const userIndex = users.findIndex((user) => user.username === username);
    if (userIndex < 0) {
      return { error: "User not found" };
    }
    users[userIndex].topic = topic;
    return this.rooms[code];
  }

  setRoleForUser(code: string, username: string, role: ERoles) {
    const users = this.getRoomUsers(code);
    const userIndex = users.findIndex((user) => user.username === username);
    if (userIndex < 0) {
      return { error: "User not found" };
    }
    users[userIndex].role = role;
    return this.rooms[code];
  }

  closeRoomIfEmpty(code: string) {
    if (!code || !this.rooms[code]) return;
    const allowDelete = this.rooms[code].users.every((user) => !user.online);
    if (allowDelete) {
      delete this.rooms[code];
    }
  }
}

let serverStore: ServerStore;
if (process.env.NODE_ENV === "development") {
  if (!global.serverStore) {
    global.serverStore = new ServerStore();
  }
  serverStore = global.serverStore;
} else {
  serverStore = new ServerStore();
}

export default serverStore;
