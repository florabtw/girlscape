import { SlashCommandBuilder } from "discord.js";

import clan from "#clan/clan.js";

export default {
  data: new SlashCommandBuilder()
    .setName("clanrank")
    .setDescription("Provides clank rank statistics.")
    .addStringOption((option) =>
      option.setName("rsn").setDescription("osrs username").setRequired(true),
    ),
  async execute(interaction) {
    await interaction.deferReply();
    const rsn = interaction.options.getString("rsn");
    const rank = await clan.rank(rsn);
    await interaction.editReply(rank);
  },
};
