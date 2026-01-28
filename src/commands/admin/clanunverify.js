import { SlashCommandBuilder } from "discord.js";

import clan from "#clan/clan.js";
import { verifiedOptions } from "#clan/rank/utils.js";

export default {
  data: new SlashCommandBuilder()
    .setName("clanunverify")
    .setDescription("Remove milestone from user.")
    .addStringOption((option) =>
      option.setName("rsn").setDescription("osrsusername").setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("milestone")
        .setDescription("milestone shortname")
        .setRequired(true)
        .addChoices(verifiedOptions),
    ),
  async execute(interaction) {
    await interaction.deferReply();

    const rsn = interaction.options.getString("rsn").toLowerCase();
    const milestone = interaction.options.getString("milestone");

    try {
      await clan.unverify(rsn, milestone);

      await interaction.editReply(
        `:white_check_mark: Removed ${milestone} from player ${rsn}`,
      );
    } catch (err) {
      await interaction.editReply(err.toString());
    }
  },
};
