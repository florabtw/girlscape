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

export async function getStats(rsn) {
  const db = await getRedisClient();
  const clanStats = await db.json.get("clan:stats");

  return Object.values(clanStats).find(
    (stats) =>
      stats.player.toLowerCase() === rsn ||
      stats.player_name_with_capitalization?.toLowerCase() === rsn,
  );
}

export async function getCollectionLog(rsn) {
  const db = await getRedisClient();
  const clanCollectionLog = await db.json.get("clan:collectionLog");

  return clanCollectionLog.members.find(
    (member) =>
      member.player.toLowerCase() === rsn ||
      member.player_name_with_capitalization.toLowerCase() === rsn,
  );
}

export async function getPets(rsn) {
  const db = await getRedisClient();
  const clanPets = await db.json.get("clan:pets");

  return clanPets.members.find(
    (member) =>
      member.player.toLowerCase() === rsn ||
      member.player_name_with_capitalization.toLowerCase() === rsn,
  );
}

export async function getVerifieds(rsn) {
  const db = await getRedisClient();
  const clanVerifieds = (await db.json.get("clan:verifieds")) || {};
  const verifieds = clanVerifieds[rsn];
}
