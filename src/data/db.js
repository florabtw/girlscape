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

export async function getClanEvents() {
  const db = await getRedisClient();
  const events = await db.json.get("clan:events");
  return events || {};
}

export async function getPlayerEvents(player) {
  const events = Object.values(await getClanEvents());

  const played = events.filter((event) => event.players.includes(player));
  const won = events.filter((event) => event.winners.includes(player));

  return { played, won };
}

export async function getEvent(id) {
  const db = await getRedisClient();
  const events = await db.json.get("clan:events");
  return events[id];
}

export async function getStats(rsn) {
  const db = await getRedisClient();
  const clanStats = await db.json.get("clan:stats");

  return Object.values(clanStats).find(
    (stats) => stats.player.toLowerCase() === rsn,
  );
}

export async function getCollectionLog(rsn) {
  const db = await getRedisClient();
  const clanCollectionLog = await db.json.get("clan:collectionLog");

  return clanCollectionLog.members.find(
    (member) => member.player.toLowerCase() === rsn,
  );
}

export async function getNormalizedPlayerNames() {
  const db = await getRedisClient();
  const clanStats = await db.json.get("clan:stats");

  return Object.keys(clanStats).map((key) => key.toLowerCase());
}

export async function getPlayerNames() {
  const db = await getRedisClient();
  const clanStats = await db.json.get("clan:stats");

  return Object.values(clanStats).map(
    (player) => player.player_name_with_capitalization || player.player,
  );
}

export async function getPets(rsn) {
  const db = await getRedisClient();
  const clanPets = await db.json.get("clan:pets");

  return clanPets.members.find((member) => member.player.toLowerCase() === rsn);
}

export async function getVerifieds(rsn) {
  const db = await getRedisClient();
  const clanVerifieds = (await db.json.get("clan:verifieds")) || {};
  return clanVerifieds[rsn];
}
