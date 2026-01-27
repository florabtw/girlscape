import { SlashCommandBuilder } from "discord.js";

import player from "#rank/player.js";
import formatter from "#rank/format.js";

export default {
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("Provides clank rank statistics.")
    .addStringOption((option) =>
      option.setName("rsn").setDescription("osrs username").setRequired(true),
    ),
  async execute(interaction) {
    await interaction.deferReply();
    const rsn = interaction.options.getString("rsn");
    const rank = await player.rank(rsn);
    const reply = formatter.rank(rank);
    await interaction.editReply(reply);
  },
};
