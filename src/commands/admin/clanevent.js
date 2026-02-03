import { SlashCommandBuilder } from "discord.js";
import Fuse from "fuse.js";

import { getClanEvents, getPlayerNames } from "#data/db.js";
import events from "#events/events.js";

const multiplayerSubcommand = (name, description, count) => (subcommand) => {
  let command = subcommand
    .setName(name)
    .setDescription(description)
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("Event ID")
        .setAutocomplete(true)
        .setRequired(true),
    );

  for (let i = 1; i <= count; i++) {
    command = command.addStringOption((option) =>
      option
        .setName(`player${i}`)
        .setDescription("player rsn")
        .setAutocomplete(true),
    );
  }

  return command;
};

function getPlayers(options, count) {
  let players = [];
  for (let i = 1; i <= count; i++) {
    const player = options.getString(`player${i}`);
    if (player?.length > 0) players.push(player);
  }
  return players;
}

export default {
  data: new SlashCommandBuilder()
    .setName("clanevent")
    .setDescription("Commands related to event management")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("new")
        .setDescription("Create a new event")
        .addStringOption((option) =>
          option
            .setName("id")
            .setDescription("Database ID")
            .setRequired(true)
            .setMaxLength(12),
        )
        .addStringOption((option) =>
          option.setName("name").setDescription("Event name").setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("list").setDescription("List all events"),
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("info").setDescription("Show details for event"),
    )
    .addSubcommand(
      multiplayerSubcommand("addplayer", "Adds players to event", 24),
    )
    .addSubcommand(
      multiplayerSubcommand("remplayer", "Removes players from event", 24),
    )
    .addSubcommand(
      multiplayerSubcommand("setwinner", "Sets winners for event", 5),
    ),
  async autocomplete(interaction) {
    const focusedOption = interaction.options.getFocused(true);

    let options;
    if (focusedOption.name === "id") {
      const events = Object.values(await getClanEvents());

      if (!focusedOption.value) {
        options = events.map((event) => ({
          name: event.name,
          value: event.id,
        }));
      } else {
        const fuse = new Fuse(events, { keys: ["id", "name"] });
        const items = fuse.search(focusedOption.value);
        options = items.map((opt) => ({
          name: opt.item.name,
          value: opt.item.id,
        }));
      }
    } else if (focusedOption.name.startsWith("player")) {
      const names = await getPlayerNames();

      if (!focusedOption.value) {
        options = names.map((name) => ({ name, value: name }));
      } else {
        const fuse = new Fuse(names);
        const items = fuse.search(focusedOption.value);
        options = items.map((opt) => ({ name: opt.item, value: opt.item }));
      }
    }

    await interaction.respond(options);
  },
  async execute(interaction) {
    await interaction.deferReply();
    const subcommand = interaction.options.getSubcommand();
    let message;
    if (subcommand === "new") {
      const eventId = interaction.options.getString("id");
      const name = interaction.options.getString("name");
      message = await events.create(eventId, name);
    } else if (subcommand === "list") {
      message = await events.list();
    } else if (subcommand === "info") {
      // TODO
    } else if (subcommand === "addplayer") {
      const id = interaction.options.getString("id");
      const players = getPlayers(interaction.options, 25);
      message = await events.addPlayers(id, players);
    } else if (subcommand === "remplayer") {
    } else if (subcommand === "winner") {
    }

    await interaction.editReply(message);
  },
};
