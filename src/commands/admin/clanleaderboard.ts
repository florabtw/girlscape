import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import clan from "#clan/clan.js";

export default {
  data: new SlashCommandBuilder()
    .setName("clanleaderboard")
    .setDescription("Responds with clan leaderboard"),
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const { getImage } = await clan.leaderboard();
    const image = await getImage();
    await interaction.editReply({ files: [image] });
  },
};
