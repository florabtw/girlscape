import { createClient } from "redis";

import config from "#config.js";

let db;

async function createRedisClient() {
  db = await createClient({ url: config.redis.url })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();
}

export async function getRedisClient() {
  if (!db) await createRedisClient();
  return db;
}
