import Format from "#clan/format/index.js";
import { getPlayerIcon, getPlayerIcons, getRedisClient } from "#data/db";
import { getAllIcons } from "#utils/icon";
import { AttachmentBuilder, EmbedBuilder } from "discord.js";

async function get(player: string) {
  const icon = await getPlayerIcon(player);

  if (!icon) {
    return {
      embeds: [],
      files: [],
      content: `:warning: No icon override for ${player}`,
    };
  }

  const iconPath = `./src/images/ranks/Clan_icon_${icon}.png`;
  const iconAttachment = new AttachmentBuilder(iconPath);

  const embed = new EmbedBuilder()
    .setTitle("Current player icon")
    .setThumbnail(`attachment://Clan_icon_${icon}.png`)
    .addFields({
      inline: true,
      name: "Player",
      value: player,
    })
    .addFields({
      inline: true,
      name: "Icon",
      value: icon,
    });
  return {
    content: "",
    embeds: [embed],
    files: [iconAttachment],
  };
}

async function set(player: string, icon: string) {
  const playerIcons = await getPlayerIcons();

  playerIcons[player] = icon;

  const db = await getRedisClient();
  db.json.set("clan:playerIcons", "$", playerIcons);

  const iconPath = `./src/images/ranks/Clan_icon_${icon}.png`;
  const iconAttachment = new AttachmentBuilder(iconPath);

  const embed = new EmbedBuilder()
    .setTitle("Player icon updated")
    .setThumbnail(`attachment://Clan_icon_${icon}.png`)
    .addFields({
      inline: true,
      name: "Player",
      value: player,
    })
    .addFields({
      inline: true,
      name: "Icon",
      value: icon,
    });
  return {
    embeds: [embed],
    files: [iconAttachment],
  };
}

async function list() {
  const icons = getAllIcons();

  const message = await Format.icons(icons);

  return { message };
}

export default {
  get,
  list,
  set,
};
