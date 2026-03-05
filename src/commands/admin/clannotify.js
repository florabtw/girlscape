import { SlashCommandBuilder } from "discord.js";

import clan from "#clan/clan.js";
import { getRedisClient } from "#data/db.js";

export default {
  data: new SlashCommandBuilder()
    .setName("clannotify")
    .setDescription("Set notification settings")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("rankchange")
        .setDescription("Webhook for rank changes")
        .addStringOption((option) =>
          option.setName("url").setDescription("Webhook url"),
        ),
    ),
  async execute(interaction) {
    await interaction.deferReply();

    const db = await getRedisClient();
    const webhooks = (await db.json.get("clan:webhooks")) || {};

    const rankChange = interaction.options.getString("url");
    webhooks.rankChange = rankChange;

    await db.json.set("clan:webhooks", "$", webhooks);

    await interaction.editReply(
      ":white_check_mark: Set rankchange webhook url",
    );
  },
};
