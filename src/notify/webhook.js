import { AttachmentBuilder, EmbedBuilder, WebhookClient } from "discord.js";

import { getRedisClient } from "#data/db.js";
import { getRankIcon } from "#utils/icon.js";

// handle rank up and down
// handle NEW players
async function rankChange({ currentPlayer, lastPlayer }) {
  const db = await getRedisClient();
  const webhooks = (await db.json.get("clan:webhooks")) || {};
  const url = webhooks.rankChange;

  if (!url) return;

  const client = new WebhookClient({ url });

  const icon = getRankIcon(currentPlayer);
  const iconAttachment = new AttachmentBuilder(icon.path);

  const diff =
    currentPlayer.summary.rank.current - lastPlayer?.summary.rank.current;
  const descriptor = diff < 0 ? "gained" : "lost";
  const color = diff < 0 ? 0x00a000 : 0xc00000;

  const embed = new EmbedBuilder()
    .setTitle("Rank Change")
    .setDescription(`${currentPlayer.rsn} has ${descriptor} a rank!`)
    .setColor(color)
    .setThumbnail(`attachment://${icon.fileName}`)
    .addFields({
      inline: true,
      name: "Previous Rank",
      value: lastPlayer ? String(lastPlayer.summary.rank.current) : "n/a",
    })
    .addFields({
      inline: true,
      name: "New Rank",
      value: String(currentPlayer.summary.rank.current),
    });

  client.send({
    embeds: [embed],
    files: [iconAttachment],
  });
}

export default {
  rankChange,
};
