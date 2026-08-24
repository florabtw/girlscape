import { createClient, type RedisClientType } from "redis";

import config from "#config";
import type { ClanEventList, PlayerEvents } from "#types/events";
import type { ClanClog, PlayerClog, ClanStats } from "#types/temple";
import type { ClanVerifieds, PlayerIcons } from "#types/db";

let db: RedisClientType;
let isReady: boolean;

async function createRedisClient() {
  if (!isReady) {
    db = createClient({ url: config.redis.url! });
    db.on("error", (err) => console.log("Redis Client Error", err));
    db.on("ready", () => {
      isReady = true;
    });
    await db.connect();
  }

  return db;
}

export async function getRedisClient() {
  if (!db) await createRedisClient();
  return db;
}

type JSONGet<T> = T | null;

export async function getClanEvents(): Promise<ClanEventList> {
  const db = await getRedisClient();
  const events = (await db.json.get("clan:events")) as JSONGet<ClanEventList>;
  return events || {};
}

export async function getPlayerEvents(player: string): Promise<PlayerEvents> {
  const events = Object.values(await getClanEvents());

  const played = events.filter((event) => event.players.includes(player));
  const won = events.filter((event) => event.winners.includes(player));

  return { played, won };
}

export async function getEvent(id: string) {
  const events = await getClanEvents();
  return events[id];
}

export async function getPlayerIcons(): Promise<PlayerIcons> {
  const db = await getRedisClient();
  const playerIcons = (await db.json.get(
    "clan:playerIcons",
  )) as JSONGet<PlayerIcons>;
  return playerIcons || {};
}

export async function getPlayerIcon(player: string) {
  const playerIcons = await getPlayerIcons();
  return playerIcons[player];
}

async function getClanStats() {
  const db = await getRedisClient();
  const clanStats = (await db.json.get("clan:stats")) as JSONGet<ClanStats>;

  return clanStats || {};
}

export async function getStats(rsn: string) {
  const clanStats = await getClanStats();

  return Object.values(clanStats || {}).find(
    (stats) => stats.player.toLowerCase() === rsn,
  );
}

export async function getCollectionLog(rsn: string) {
  const db = await getRedisClient();
  const clanCollectionLog = (await db.json.get(
    "clan:collectionLog",
  )) as JSONGet<ClanClog>;

  return clanCollectionLog?.members.find(
    (member) => member.player.toLowerCase() === rsn,
  );
}

export async function getMissingNames() {
  const clanEvents = await getClanEvents();
  const eventNames = Object.values(clanEvents).reduce(
    (names, event) =>
      names.union(new Set(event.players)).union(new Set(event.winners)),
    new Set<string>(),
  );

  const clanVerifieds = (await db.json.get("clan:verifieds")) || {};
  const verifiedNames = new Set(Object.keys(clanVerifieds));

  const localNames = eventNames.union(verifiedNames);
  const templeNames = new Set(await getNormalizedPlayerNames());

  const localOnly = [...localNames.difference(templeNames)];
  const remoteOnly = [...templeNames.difference(localNames)];

  return { localOnly, remoteOnly };
}

export async function getNormalizedPlayerNames() {
  const clanStats = await getClanStats();

  return Object.keys(clanStats).map((key) => key.toLowerCase());
}

export async function getPlayerNames() {
  const clanStats = await getClanStats();

  return Object.values(clanStats).map(
    (player) => player.player_name_with_capitalization || player.player,
  );
}

async function getClanPets(): Promise<PlayerClog[]> {
  const db = await getRedisClient();
  const clanPets = (await db.json.get("clan:pets")) as JSONGet<ClanClog>;

  return clanPets?.members || [];
}

export async function getPets(rsn: string) {
  const clanPets = await getClanPets();

  return clanPets.find((member) => member.player.toLowerCase() === rsn);
}

async function getClanVerifieds() {
  const db = await getRedisClient();
  const clanVerifieds = (await db.json.get(
    "clan:verifieds",
  )) as JSONGet<ClanVerifieds>;

  return clanVerifieds || {};
}

export async function getVerifieds(rsn: string) {
  const clanVerifieds = await getClanVerifieds();
  return clanVerifieds[rsn];
}
