import { SlashCommandBuilder } from "discord.js";

import Autocomplete from "#utils/autocomplete.js";
import clan from "#clan/clan.js";
import { normalizeRsn } from "#clan/rank/utils.js";

export default {
  data: new SlashCommandBuilder()
    .setName("clannamechange")
    .setDescription("Update rsn in girlscape bot. Run /clanupdate first!")
    .addStringOption((option) =>
      option
        .setName("old_rsn")
        .setDescription("old rsn")
        .setRequired(true)
        .setAutocomplete(true),
    )
    .addStringOption((option) =>
      option
        .setName("new_rsn")
        .setDescription("new rsn")
        .setRequired(true)
        .setAutocomplete(true),
    ),
  async autocomplete(interaction) {
    const focusedOption = interaction.options.getFocused(true);

    if (focusedOption.name === "old_rsn") {
      await Autocomplete.oldName(interaction);
    } else {
      await Autocomplete.newName(interaction);
    }
  },
  async execute(interaction) {
    await interaction.deferReply();
    const oldRsn = normalizeRsn(interaction.options.getString("old_rsn"));
    const newRsn = normalizeRsn(interaction.options.getString("new_rsn"));
    const { message } = await clan.nameChange(oldRsn, newRsn);
    await interaction.editReply(message);
  },
};
