const TEMPLE_BASE_URL = "https://templeosrs.com/api";
const CLAN_ID = 3426;

// ------------- STATS --------------

async function getClanStats() {
  const res = await fetch(
    `${TEMPLE_BASE_URL}/group_member_info.php?id=${CLAN_ID}&skills=1&bosses=1`,
  );
  const body = await res.json();

  return body.data.memberlist;
}

async function getPlayerStats(rsn) {
  const res = await fetch(
    `${TEMPLE_BASE_URL}/player_stats.php?player=${rsn}&bosses=1`,
  );
  const body = await res.json();
  return body.data;
}

// ---------------- COLLECTION LOG -------------

let clogItems;
let clogIds;

async function fetchCollectionLogItems() {
  // const res = await fetch(`${TEMPLE_BASE_URL}/collection-log/items.php`);
  // const body = await res.json();
  const { default: body } = await import("./json/itemids.json", {
    with: { type: "json" },
  });
  clogItems = body.items;
  clogIds = Object.fromEntries(
    Object.entries(body.items).map(([k, v]) => [v, k]),
  );
}

async function getItemName(id) {
  if (!clogItems) {
    await fetchCollectionLogItems();
  }

  return clogItems[id];
}

async function getItemId(name) {
  if (!clogIds) {
    await fetchCollectionLogItems();
  }

  return clogIds[name];
}

const clogCategories = [
  // "all_pets",
  "raids",
  "champions_challenge",
  "the_fight_caves",
  "the_inferno",
  "fortis_colosseum",
].join(",");

async function getPlayerClogs(rsn) {
  const res = await fetch(
    `${TEMPLE_BASE_URL}/collection-log/player_collection_log.php?player=${rsn}&categories=${clogCategories}`,
  );
  const body = await res.json();

  const pets = body.data.items.all_pets;
  const items = Object.values(body.data.items).flat();
  const clogs = await Promise.all(items.map(({ id }) => getItemName(id)));

  return { clogs, pets };
}

async function getClanCollectionLogs() {
  const res = await fetch(
    `${TEMPLE_BASE_URL}/collection-log/group_collection_log.php?group=${CLAN_ID}&categories=${clogCategories}`,
  );
  const body = await res.json();

  // map ids to { id, name }
  const data = body.data;
  const members = await Promise.all(
    data.members.map(async (member) => {
      member.items = await Promise.all(
        member.items.map(async (id) => ({ id, name: await getItemName(id) })),
      );
      return member;
    }),
  );
  data.members = members;

  return data;
}

async function getClanPets() {
  const res = await fetch(
    `${TEMPLE_BASE_URL}/collection-log/group_collection_log.php?group=${CLAN_ID}&categories=all_pets`,
  );
  const body = await res.json();

  // map ids to { id, name }
  const data = body.data;
  const members = await Promise.all(
    data.members.map(async (member) => {
      member.items = await Promise.all(
        member.items.map(async (id) => ({ id, name: await getItemName(id) })),
      );
      return member;
    }),
  );
  data.members = members;

  return data;
}

// ---------------- EXPORT ---------------

export default {
  collectionLog: {
    clan: getClanCollectionLogs,
    player: getPlayerClogs,
    itemName: getItemName,
    itemId: getItemId,
  },
  pets: {
    clan: getClanPets,
  },
  stats: {
    clan: getClanStats,
    player: getPlayerStats,
  },
};
