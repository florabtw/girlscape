import Fuse from "fuse.js";

import { getClanEvents, getMissingNames, getPlayerNames } from "#data/db.js";
import type { AutocompleteInteraction } from "discord.js";
import { getAllIcons } from "./icon";

const caseInsensitive = (a: string, b: string) =>
  a.localeCompare(b, undefined, { sensitivity: "base" });

async function event(interaction: AutocompleteInteraction) {
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

  options = options.slice(0, 25);

  await interaction.respond(options);
}

async function icon(interaction: AutocompleteInteraction) {
  const focusedValue = interaction.options.getFocused();

  const icons = getAllIcons();
  icons.sort(caseInsensitive);

  let options;
  if (!focusedValue) {
    options = icons.map((icon) => ({ name: icon, value: icon }));
  } else {
    const fuse = new Fuse(icons);
    const items = fuse.search(focusedValue);
    options = items.map((opt) => ({ name: opt.item, value: opt.item }));
  }

  options = options.slice(0, 25);

  await interaction.respond(options);
}

async function name(interaction: AutocompleteInteraction) {
  const focusedValue = interaction.options.getFocused();
  const names = await getPlayerNames();
  names.sort(caseInsensitive);

  let options;
  if (!focusedValue) {
    options = names.map((name) => ({ name, value: name }));
  } else {
    const fuse = new Fuse(names);
    const items = fuse.search(focusedValue);
    options = items.map((opt) => ({ name: opt.item, value: opt.item }));
  }

  options = options.slice(0, 25);

  await interaction.respond(options);
}

async function oldName(interaction: AutocompleteInteraction) {
  const focusedValue = interaction.options.getFocused();
  const { localOnly } = await getMissingNames();
  localOnly.sort(caseInsensitive);

  let options;
  if (!focusedValue) {
    options = localOnly.map((name) => ({ name, value: name }));
  } else {
    const fuse = new Fuse(localOnly);
    const items = fuse.search(focusedValue);
    options = items.map((opt) => ({ name: opt.item, value: opt.item }));
  }

  options = options.slice(0, 25);

  await interaction.respond(options);
}

async function newName(interaction: AutocompleteInteraction) {
  const focusedValue = interaction.options.getFocused();
  const { remoteOnly } = await getMissingNames();
  remoteOnly.sort(caseInsensitive);

  let options;
  if (!focusedValue) {
    options = remoteOnly.map((name) => ({ name, value: name }));
  } else {
    const fuse = new Fuse(remoteOnly);
    const items = fuse.search(focusedValue);
    options = items.map((opt) => ({ name: opt.item, value: opt.item }));
  }

  options = options.slice(0, 25);

  await interaction.respond(options);
}

export default {
  event,
  icon,
  name,
  newName,
  oldName,
};
