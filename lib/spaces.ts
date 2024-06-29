import { EStage, ISpace } from "@/utils/types";
import { Redis } from "ioredis";
import { IUser } from "./user";

declare global {
  var spaces: Spaces;
}

class Spaces {
  private redis: Redis;
  private ttl: number;

  constructor() {
    this.redis = new Redis(process.env.REDIS_CONNECTION_URI as string);
    this.ttl = parseInt(process.env.TTL_VALUE ?? "7200"); // default 2 hours
  }

  async flush() {
    await this.redis.flushdb(() => console.log("\nflush\n"));
  }

  async getSpace(code: string): Promise<ISpace | null> {
    const key = `space:${code}`;
    if ((await this.redis.exists(key)) === 0) return null;
    const res = await this.redis.hgetall(key);
    if (res) {
      const space = { ...res } as unknown as ISpace;
      space.stage = parseInt(res.stage);
      space.capacity = parseInt(res.capacity);
      return space;
    }
    return null;
  }

  async createSpace(code: string, hostname: string) {
    const spaceKey = `space:${code}`;
    const hostKey = `space:${code}:user:${hostname}`;

    await this.redis
      .multi()
      .hmset(spaceKey, { host: hostname, stage: EStage.WAITING, capacity: 1 })
      .expire(spaceKey, this.ttl)
      .hset(hostKey, { name: hostname, n: 0 })
      .expire(hostKey, this.ttl)
      .exec();
  }

  async setSpaceProperty(
    code: string,
    username: string,
    options: { [key: string]: string }
  ) {
    const spaceKey = `space:${code}`;

    const space = await this.getSpace(code);
    if (!space || space.host !== username) return;
    const pipeline = this.redis.multi();
    for (const key of Object.keys(options)) {
      if (!options[key]) {
        await pipeline.hdel(spaceKey, key);
      } else {
        await pipeline.hset(spaceKey, key, options[key]);
      }
    }
    await pipeline.expire(spaceKey, this.ttl).exec();
  }

  async deleteSpace(code: string) {
    const userKeys = await this.redis.keys(`space:${code}:user:*`);
    const deletePipeLine = await this.redis.multi();
    for (const key of userKeys) {
      await deletePipeLine.del(key);
    }
    await deletePipeLine.del(`space:${code}`);
    await deletePipeLine.exec();
  }

  /* USER METHODS */
  async getUser(spaceCode: string, name: string): Promise<IUser | null> {
    const userKey = `space:${spaceCode}:user:${name}`;
    const res = (await this.redis.hgetall(userKey)) || {};
    if (res.name) {
      const user = { ...res, n: parseInt(res.n) } as IUser;
      return user;
    }
    return null;
  }

  async getSpaceUsers(code: string): Promise<IUser[]> {
    const userKeys = await this.redis.keys(`space:${code}:user:*`);
    if (!userKeys || userKeys.length === 0) return [];

    const res = await Promise.all(
      userKeys.map((key) => this.redis.hgetall(key))
    );
    if (res) {
      const users = res.map((u) => ({
        ...u,
        n: parseInt(u.n),
      })) as unknown as IUser[];
      return users.sort((a, b) => a.n - b.n);
    }

    return [];
  }

  async saveUser(spaceCode: string, name: string) {
    const space = await this.getSpace(spaceCode);
    if (!space) return;
    const spaceKey = `space:${spaceCode}`;
    const userKey = `space:${spaceCode}:user:${name}`;

    await this.redis
      .multi()
      .hset(userKey, { name, n: space.capacity })
      .expire(userKey, this.ttl)
      .hset(spaceKey, "capacity", space.capacity + 1)
      .expire(spaceKey, this.ttl)
      .exec();
  }

  async setUserProperty(
    spaceCode: string,
    name: string,
    options: { [key: string]: string }
  ) {
    const userKey = `space:${spaceCode}:user:${name}`;
    const pipeline = this.redis.multi();
    for (const key of Object.keys(options)) {
      if (!options[key]) {
        await pipeline.hdel(userKey, key);
      } else {
        await pipeline.hset(userKey, key, options[key]);
      }
    }
    await pipeline.expire(userKey, this.ttl).exec();
  }
}

let spaces: Spaces;
if (process.env.NODE_ENV === "development") {
  if (!global.spaces) {
    global.spaces = new Spaces();
  }
  spaces = global.spaces;
} else {
  spaces = new Spaces();
}
export default spaces;
