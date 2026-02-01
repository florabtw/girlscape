import { SlashCommandBuilder } from "discord.js";

import clan from "#clan/clan.js";

export default {
  data: new SlashCommandBuilder()
    .setName("clanleaderboard")
    .setDescription("Responds with clan leaderboard"),
  async execute(interaction) {
    await interaction.deferReply();
    const { message } = await clan.leaderboard();
    await interaction.editReply(message);
  },
};
