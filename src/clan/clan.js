import Format from "#clan/format.js";
import Rank from "#clan/rank/rank.js";
import db from "#data/db.js";
import temple from "#clan/temple.js";

async function rank(rsn) {
  const clanStats = await db.json.get("clan:stats");
  const clanCollectionLog = await db.json.get("clan:collectionLog");
  const clanPets = await db.json.get("clan:pets");

  const playerKey = Object.keys(clanStats).find(
    (key) => key.toLowerCase() === rsn.toLowerCase(),
  );

  const stats = clanStats[playerKey];
  const collectionLog = clanCollectionLog.members.find(
    (member) => member.player.toLowerCase() === rsn.toLowerCase(),
  );
  const pets = clanPets.members.find(
    (member) => member.player.toLowerCase() === rsn.toLowerCase(),
  );

  if (!stats) throw Error("Player stats not found in clan.");

  const rank = Rank.player({ collectionLog, pets, stats });
  const message = Format.player({ rsn, rank });

  return message;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function update() {
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

export default {
  rank,
  update,
};
