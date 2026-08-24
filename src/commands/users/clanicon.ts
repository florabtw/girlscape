import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

import Autocomplete from "#utils/autocomplete.js";
import { normalizeRsn } from "#clan/rank/utils.js";
import icon from "#clan/icon";

export default {
  data: new SlashCommandBuilder()
    .setName("clanicon")
    .setDescription("Manage top 5 icons")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("get")
        .setDescription("Get clan icon override")
        .addStringOption((option) =>
          option
            .setName(`player`)
            .setDescription("player rsn")
            .setRequired(true)
            .setAutocomplete(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set")
        .setDescription("Set clan icon override")
        .addStringOption((option) =>
          option
            .setName(`player`)
            .setDescription("player rsn")
            .setRequired(true)
            .setAutocomplete(true),
        )
        .addStringOption((option) =>
          option
            .setName("icon")
            .setDescription("Icon name")
            .setRequired(true)
            .setAutocomplete(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("List all clan icon names and images"),
    ),
  async autocomplete(interaction: AutocompleteInteraction) {
    const focusedOption = interaction.options.getFocused(true);
    if (focusedOption.name === "player") {
      await Autocomplete.name(interaction);
    } else if (focusedOption.name === "icon") {
      await Autocomplete.icon(interaction);
    }
  },
  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    if (subcommand === "get") {
      const rsn = normalizeRsn(interaction.options.getString("player")!);
      const { content, embeds, files } = await icon.get(rsn);
      await interaction.reply({ content, embeds, files });
    } else if (subcommand === "set") {
      const rsn = normalizeRsn(interaction.options.getString("player")!);
      const iconName = interaction.options.getString("icon")!;
      const { embeds, files } = await icon.set(rsn, iconName);
      await interaction.reply({ embeds, files });
    } else if (subcommand === "list") {
      await interaction.deferReply();
      const { message } = await icon.list();
      await interaction.editReply({ files: [message] });
    }
  },
};
