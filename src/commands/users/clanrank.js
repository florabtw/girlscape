import { SlashCommandBuilder } from "discord.js";
import Fuse from "fuse.js";

import clan from "#clan/clan.js";
import { getPlayerNames } from "#data/db.js";
import { normalizeRsn } from "#clan/rank/utils.js";

export default {
  data: new SlashCommandBuilder()
    .setName("clanrank")
    .setDescription("Provides clank rank statistics.")
    .addStringOption((option) =>
      option
        .setName("rsn")
        .setDescription("osrs username")
        .setRequired(true)
        .setAutocomplete(true),
    ),
  async execute(interaction) {
    await interaction.deferReply();
    const rsn = normalizeRsn(interaction.options.getString("rsn"));
    const { message } = await clan.rank(rsn);
    await interaction.editReply(message);
  },
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    const names = await getPlayerNames();
    const fuse = new Fuse(names);
    const options = fuse.search(focusedValue);
    await interaction.respond(
      options.map((opt) => ({ name: opt.item, value: opt.item })),
    );
  },
};
