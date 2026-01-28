import { SlashCommandBuilder } from "discord.js";

import clan from "#clan/clan.js";

export default {
  data: new SlashCommandBuilder()
    .setName("clanupdate")
    .setDescription("Refreshes data from TempleOSRS"),
  async execute(interaction) {
    await interaction.deferReply();
    await clan.update();
    await interaction.editReply(":white_check_mark: Updated!");
  },
};
