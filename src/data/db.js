import { createClient } from "redis";

import config from "#config.js";

const db = await createClient({ url: config.redis.url })
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

export default db;
