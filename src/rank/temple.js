const TEMPlE_BASE_URL = "https://templeosrs.com/api";

async function getPlayerStats(rsn) {
  const res = await fetch(
    `${TEMPlE_BASE_URL}/player_stats.php?player=${rsn}&bosses=1`,
  );
  const body = await res.json();
  return body.data;
}

let clogItems;

async function getClogName(id) {
  if (!clogItems) {
    const res = await fetch(`${TEMPlE_BASE_URL}/collection-log/items.php`);
    const body = await res.json();
    clogItems = body.items;
  }

  return clogItems[id];
}

const clogCategories = [
  "raids",
  "all_pets",
  "champions_challenge",
  "the_fight_caves",
  "the_inferno",
  "fortis_colosseum",
].join(",");

async function getPlayerClogs(rsn) {
  const res = await fetch(
    `${TEMPlE_BASE_URL}/collection-log/player_collection_log.php?player=${rsn}&categories=${clogCategories}`,
  );
  const body = await res.json();

  const pets = body.data.items.all_pets;
  const items = Object.values(body.data.items).flat();
  const clogs = await Promise.all(items.map(({ id }) => getClogName(id)));

  return { clogs, pets };
}

export default {
  getClogName,
  getPlayerStats,
  getPlayerClogs,
};
