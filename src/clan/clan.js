import Format from "#clan/format.js";
import Rank from "#clan/rank/rank.js";
import temple from "#clan/temple.js";
import { getRedisClient } from "#data/db.js";

async function rank(rsn) {
  const db = await getRedisClient();

  const clanStats = await db.json.get("clan:stats");
  const clanCollectionLog = await db.json.get("clan:collectionLog");
  const clanPets = await db.json.get("clan:pets");
  const clanVerifieds = (await db.json.get("clan:verifieds")) || {};

  const [_statsRsn, stats] =
    Object.entries(clanStats).find(([key]) => key.toLowerCase() === rsn) || [];

  const collectionLog = clanCollectionLog.members.find(
    (member) => member.player.toLowerCase() === rsn,
  );
  const pets = clanPets.members.find(
    (member) => member.player.toLowerCase() === rsn,
  );
  const verifieds = clanVerifieds[rsn];

  if (!stats) throw Error("Player stats not found in clan.");

  const rank = Rank.player({ collectionLog, pets, stats, verifieds });
  const message = Format.player(rank);

  return { rank, message };
}

function byRank(a, b) {
  let sort = b.rank.summary.rank - a.rank.summary.rank;
  if (sort === 0) {
    sort = b.rank.summary.points - a.rank.summary.points;
  }
  if (sort === 0) {
    sort = b.rank.summary.progress - a.rank.summary.progress;
  }
  return sort;
}

async function leaderboard() {
  const db = await getRedisClient();

  const clanStats = await db.json.get("clan:stats");
  const players = Object.keys(clanStats).map((rsn) => rsn.toLowerCase());

  const ranks = await Promise.all(players.map(rank));
  ranks.sort(byRank);

  const message = Format.leaderboard(ranks);

  return message;
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

  const clanStats = await db.json.get("clan:stats");
  const isClanPlayer = Object.keys(clanStats).find(
    (key) => key.toLowerCase() === rsn,
  );
  if (!isClanPlayer) throw new Error(`Player ${rsn} not found in clan.`);

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

async function unverify(rsn, milestone) {
  const db = await getRedisClient();

  const clanStats = await db.json.get("clan:stats");
  const isClanPlayer = Object.keys(clanStats).find(
    (key) => key.toLowerCase() === rsn,
  );
  if (!isClanPlayer) throw new Error(`Player ${rsn} not found in clan.`);

  const verifieds = (await db.json.get("clan:verifieds")) || {};

  const playerVerified = verifieds[rsn] || {};
  playerVerified[milestone] = false;

  verifieds[rsn] = playerVerified;

  await db.json.set("clan:verifieds", "$", verifieds);

  console.log(
    `Unverified ${rsn} ${milestone}. Player verifieds: `,
    JSON.stringify(playerVerified, null, 2),
  );
}

export default {
  leaderboard,
  rank,
  unverify,
  update,
  verify,
};
