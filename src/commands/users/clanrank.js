import { SlashCommandBuilder } from "discord.js";
import Fuse from "fuse.js";

import Autocomplete from "#utils/autocomplete.js";
import clan from "#clan/clan.js";
import { normalizeRsn } from "#clan/rank/utils.js";

export default {
  data: new SlashCommandBuilder()
    .setName("clanrank")
    .setDescription("Provides clank rank statistics.")
    .addStringOption((option) =>
      option
        .setName("player")
        .setDescription("osrs username")
        .setRequired(true)
        .setAutocomplete(true),
    ),
  async execute(interaction) {
    await interaction.deferReply();
    const rsn = normalizeRsn(interaction.options.getString("player"));
    const { message } = await clan.rank(rsn);
    await interaction.editReply(message);
  },
  async autocomplete(interaction) {
    const focusedOption = interaction.options.getFocused(true);
    if (focusedOption.name === "player") {
      await Autocomplete.name(interaction);
    }
  },
};
