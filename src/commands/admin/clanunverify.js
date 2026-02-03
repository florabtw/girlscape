import { SlashCommandBuilder } from "discord.js";

import Autocomplete from "#utils/autocomplete.js";
import clan from "#clan/clan.js";
import { normalizeRsn, verifiedOptions } from "#clan/rank/utils.js";

function genCommand() {
  const command = new SlashCommandBuilder()
    .setName("clanunverify")
    .setDescription("Remove milestones from user.")
    .addStringOption((option) =>
      option
        .setName("player")
        .setDescription("osrs username")
        .setRequired(true)
        .setAutocomplete(true),
    );

  for (let i = 1; i <= 10; i++) {
    command.addStringOption((option) =>
      option
        .setName(`milestone${i}`)
        .setDescription("milestone to remove")
        .addChoices(verifiedOptions),
    );
  }

  return command;
}

function getMilestones(interaction) {
  let milestones = [];
  for (let i = 1; i <= 10; i++) {
    const milestone = interaction.options.getString(`milestone${i}`);
    if (milestone?.length > 0) milestones.push(milestone);
  }
  return milestones;
}

export default {
  data: genCommand(),
  async autocomplete(interaction) {
    const focusedOption = interaction.options.getFocused(true);

    if (focusedOption.name === "player") {
      await Autocomplete.name(interaction);
    }
  },
  async execute(interaction) {
    await interaction.deferReply();

    const player = normalizeRsn(interaction.options.getString("player"));
    const milestones = getMilestones(interaction);

    try {
      await clan.unverify(player, milestones);
      await interaction.editReply(
        `:white_check_mark: Removed milestones from player ${player}: ${milestones.join(", ")}`,
      );
    } catch (err) {
      await interaction.editReply(err.toString());
    }
  },
};
