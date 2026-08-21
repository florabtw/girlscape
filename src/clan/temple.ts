import type {
  ClanStatsResponse,
  ClanStats,
  DetailPlayerStats,
  TempleResponse,
  DetailPlayerClog,
  ClanClog,
  ClanClogRaw,
} from "#types/temple";

const TEMPLE_BASE_URL = "https://templeosrs.com/api";
const CLAN_ID = 3426;

// ------------- STATS --------------

async function getClanStats(): Promise<ClanStats> {
  const res = await fetch(
    `${TEMPLE_BASE_URL}/group_member_info.php?id=${CLAN_ID}&skills=1&bosses=1`,
  );
  const body = (await res.json()) as TempleResponse<ClanStatsResponse>;

  return body.data.memberlist;
}

async function getPlayerStats(rsn: string): Promise<DetailPlayerStats> {
  const res = await fetch(
    `${TEMPLE_BASE_URL}/player_stats.php?player=${rsn}&bosses=1`,
  );
  const body = (await res.json()) as TempleResponse<DetailPlayerStats>;
  return body.data;
}

// ---------------- COLLECTION LOG -------------

let clogItems: Record<string, string>;
let clogIds: Record<string, string>;

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

async function getItemName(id: string | number) {
  if (!clogItems) {
    await fetchCollectionLogItems();
  }

  return clogItems[id] as string;
}

async function getItemId(name: string) {
  if (!clogIds) {
    await fetchCollectionLogItems();
  }

  return clogIds[name] as string;
}

const clogCategories = [
  // "all_pets",
  "raids",
  "champions_challenge",
  "the_fight_caves",
  "the_inferno",
  "fortis_colosseum",
].join(",");

async function getPlayerClogs(rsn: string) {
  const res = await fetch(
    `${TEMPLE_BASE_URL}/collection-log/player_collection_log.php?player=${rsn}&categories=${clogCategories}`,
  );
  const body = (await res.json()) as TempleResponse<DetailPlayerClog>;

  const pets = body.data.items.all_pets;
  const items = Object.values(body.data.items).flat();
  const clogs = await Promise.all(items.map(({ id }) => getItemName(id)));

  return { clogs, pets };
}

async function getClanCollectionLogs(): Promise<ClanClog> {
  const res = await fetch(
    `${TEMPLE_BASE_URL}/collection-log/group_collection_log.php?group=${CLAN_ID}&categories=${clogCategories}`,
  );
  const body = (await res.json()) as TempleResponse<ClanClogRaw>;

  // map ids to { id, name }
  const data = body.data;
  const members = await Promise.all(
    data.members.map(async (member) => {
      const items = await Promise.all(
        member.items.map(async (id) => ({ id, name: await getItemName(id) })),
      );
      return { ...member, items };
    }),
  );

  return { ...data, members };
}

async function getClanPets(): Promise<ClanClog> {
  const res = await fetch(
    `${TEMPLE_BASE_URL}/collection-log/group_collection_log.php?group=${CLAN_ID}&categories=all_pets`,
  );
  const body = (await res.json()) as TempleResponse<ClanClogRaw>;

  // map ids to { id, name }
  const data = body.data;
  const members = await Promise.all(
    data.members.map(async (member) => {
      const items = await Promise.all(
        member.items.map(async (id) => ({ id, name: await getItemName(id) })),
      );
      return { ...member, items };
    }),
  );

  return { ...data, members };
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
