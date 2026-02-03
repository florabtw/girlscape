import { getRedisClient, getPlayerNames } from "#data/db.js";
import { normalizeRsn } from "#clan/rank/utils.js";
import Format from "./format.js";

async function addPlayers(id, players) {
  const db = await getRedisClient();
  let events = (await db.json.get("clan:events")) || {};
  const event = events[id];

  if (!event) return `:x: Event not found: ${id}`;

  let output = [];
  const validNames = await getPlayerNames();
  for (const player of players) {
    const isValid = validNames.includes(player);
    if (isValid) {
      const normalizedRsn = normalizeRsn(player);
      event.players.push(normalizedRsn);
      output.push({ player, valid: true });
    } else {
      output.push({ player, valid: false });
    }
  }

  event.players = [...new Set(event.players)];

  await db.json.set("clan:events", "$", events);

  return Format.addPlayers(event, output);
}

async function create(id, name) {
  const db = await getRedisClient();
  let events = (await db.json.get("clan:events")) || {};

  if (events[id]) return `:x: Event already exists`;

  const event = { id, name, players: [], winners: [] };
  events[id] = event;

  await db.json.set("clan:events", "$", events);

  return `:white_check_mark: Created new event:\n ${Format.summary(event)}`;
}

async function list() {
  const db = await getRedisClient();
  const events = (await db.json.get("clan:events")) || {};

  const list = Object.values(events);

  return Format.list(list);
}

export default {
  addPlayers,
  create,
  list,
};
