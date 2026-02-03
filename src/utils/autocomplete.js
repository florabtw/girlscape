import Fuse from "fuse.js";

import { getClanEvents, getPlayerNames } from "#data/db.js";

async function event(interaction) {
  const focusedValue = interaction.options.getFocused();
  const events = Object.values(await getClanEvents());

  let options;
  if (!focusedValue) {
    options = events.map((event) => ({
      name: event.name,
      value: event.id,
    }));
  } else {
    const fuse = new Fuse(events, { keys: ["id", "name"] });
    const items = fuse.search(focusedValue);
    options = items.map((opt) => ({
      name: opt.item.name,
      value: opt.item.id,
    }));
  }

  await interaction.respond(options);
}

async function name(interaction) {
  const focusedValue = interaction.options.getFocused();
  const names = await getPlayerNames();

  let options;
  if (!focusedValue) {
    options = names.map((name) => ({ name, value: name }));
  } else {
    const fuse = new Fuse(names);
    const items = fuse.search(focusedValue);
    options = items.map((opt) => ({ name: opt.item, value: opt.item }));
  }

  await interaction.respond(options);
}

export default {
  event,
  name,
};
