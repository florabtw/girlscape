import { SlashCommandBuilder } from "discord.js";

import clan from "#clan/clan.js";
import { verifiedOptions } from "#clan/rank/utils.js";

export default {
  data: new SlashCommandBuilder()
    .setName("clanverify")
    .setDescription("Verify user has met requirements for a clan milestone.")
    .addStringOption((option) =>
      option.setName("rsn").setDescription("osrsusername").setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("milestone1")
        .setDescription("milestone shortname")
        .setRequired(true)
        .addChoices(verifiedOptions),
    )
    .addStringOption((option) =>
      option
        .setName("milestone2")
        .setDescription("milestone shortname")
        .addChoices(verifiedOptions),
    )
    .addStringOption((option) =>
      option
        .setName("milestone3")
        .setDescription("milestone shortname")
        .addChoices(verifiedOptions),
    )
    .addStringOption((option) =>
      option
        .setName("milestone4")
        .setDescription("milestone shortname")
        .addChoices(verifiedOptions),
    )
    .addStringOption((option) =>
      option
        .setName("milestone5")
        .setDescription("milestone shortname")
        .addChoices(verifiedOptions),
    ),
  async execute(interaction) {
    await interaction.deferReply();

    const rsn = interaction.options.getString("rsn").toLowerCase();

    const milestones = [
      interaction.options.getString("milestone1"),
      interaction.options.getString("milestone2"),
      interaction.options.getString("milestone3"),
      interaction.options.getString("milestone4"),
      interaction.options.getString("milestone5"),
    ].filter((string) => !!string);

    try {
      await clan.verify(rsn, milestones);

      await interaction.editReply(
        `:white_check_mark: Verified ${rsn} has completed ${milestones.join(", ")}`,
      );
    } catch (err) {
      await interaction.editReply(err.toString());
    }
  },
};
