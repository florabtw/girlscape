import Format from "#clan/format/index.js";
import Rank from "#clan/rank/rank.js";
import TopFive from "#clan/rank/topfive.js";
import temple from "#clan/temple.js";
import { normalizeRsn } from "#clan/rank/utils.js";
import {
  getCollectionLog,
  getMissingNames,
  getPets,
  getPlayerEvents,
  getRedisClient,
  getStats,
  getVerifieds,
} from "#data/db.js";

async function rank(rsn) {
  const stats = await getStats(rsn);
  if (!stats) throw Error("Player stats not found in clan.");

  const { players } = await leaderboard();

  const player = players.find((p) => normalizeRsn(p.rsn) === rsn);
  const message = Format.player(player);

  return { player, message };
}

function byRank(a, b) {
  let sort = b.summary.rank.current - a.summary.rank.current;
  if (sort === 0) {
    sort = b.summary.points - a.summary.points;
  }
  if (sort === 0) {
    sort = b.summary.progress - a.summary.progress;
  }
  return sort;
}

async function leaderboard() {
  const db = await getRedisClient();
  const clanStats = await db.json.get("clan:stats");
  const playerNames = Object.keys(clanStats).map(normalizeRsn);

  let players = [];
  for (const rsn of playerNames) {
    const collectionLog = await getCollectionLog(rsn);
    const events = await getPlayerEvents(rsn);
    const pets = await getPets(rsn);
    const stats = await getStats(rsn);
    const verifieds = await getVerifieds(rsn);

    const player = Rank.player({
      collectionLog,
      events,
      pets,
      stats,
      verifieds,
    });

    players.push(player);
  }

  players.sort(byRank);
  players = TopFive.apply(players);

  const message = await Format.leaderboardImage(players);

  return { players, message };
}

async function nameChange(oldRsn, newRsn) {
  const { localOnly, remoteOnly } = await getMissingNames();

  const db = await getRedisClient();
  const verifieds = (await db.json.get("clan:verifieds")) || {};

  if (verifieds[oldRsn]) {
    verifieds[newRsn] = verifieds[oldRsn];
    delete verifieds[oldRsn];
  }

  let events = (await db.json.get("clan:events")) || {};
  events = Object.fromEntries(
    Object.entries(events).map(([key, event]) => {
      event.players = event.players.map((p) => (p === oldRsn ? newRsn : p));
      event.winners = event.winners.map((p) => (p === oldRsn ? newRsn : p));
      return [key, event];
    }),
  );

  db.json.set("clan:verifieds", "$", verifieds);
  db.json.set("clan:events", "$", events);

  return {
    message: `:white_check_mark: Updated name from ${oldRsn} to ${newRsn}.`,
  };
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function update() {
  const db = await getRedisClient();

  const stats = await temple.stats.clan();
  await db.json.set("clan:stats", "$", stats);

  await wait(1000);

  const collectionLog = await temple.collectionLog.clan();
  await db.json.set("clan:collectionLog", "$", collectionLog);

  await wait(1000);

  const pets = await temple.pets.clan();
  await db.json.set("clan:pets", "$", pets);

  console.log("Updated!");
}

async function verify(rsn, milestones) {
  const db = await getRedisClient();

  const stats = await getStats(rsn);
  if (!stats) throw new Error(`Player ${rsn} not found in clan.`);

  const verifieds = (await db.json.get("clan:verifieds")) || {};

  const playerVerified = verifieds[rsn] || {};

  for (const milestone of milestones) {
    playerVerified[milestone] = true;
  }

  verifieds[rsn] = playerVerified;

  await db.json.set("clan:verifieds", "$", verifieds);

  console.log(
    `Verified ${rsn} ${milestones.join(", ")}. Player verifieds: `,
    JSON.stringify(playerVerified, null, 2),
  );
}

async function unverify(rsn, milestones) {
  const db = await getRedisClient();

  const stats = await getStats(rsn);
  if (!stats) throw new Error(`Player ${rsn} not found in clan.`);

  const verifieds = (await db.json.get("clan:verifieds")) || {};

  const playerVerified = verifieds[rsn] || {};
  for (const milestone of milestones) {
    playerVerified[milestone] = false;
  }

  verifieds[rsn] = playerVerified;

  await db.json.set("clan:verifieds", "$", verifieds);

  console.log(
    `Unverified ${rsn} ${milestones.join(", ")}. Player verifieds: `,
    JSON.stringify(playerVerified, null, 2),
  );
}

export default {
  leaderboard,
  nameChange,
  rank,
  unverify,
  update,
  verify,
};
