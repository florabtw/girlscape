import fs from "node:fs";

const Ranks = [
  "Elite",
  "Defiler",
  "Onyx",
  "Seer",
  "Legacy",
  "Raider",
  "Hero",
  "Dragonstone",
  "Warlock",
  "Ignitor",
  "Completionist",
  "Trialist",
  "Red_Topaz",
  "Witch",
  "Artisan",
  "Adventurer",
  "Pure",
  "Zenyte",
  "Trickster",
  "Specialist",
  "Explorer",
  "Champion",
  "Illusionist",
  "Burnt",
];

export function getRankIcon(rank: number) {
  return Ranks[Math.min(rank - 1, Ranks.length - 1)];
}

export function getIconFileName(rank: string) {
  return `Clan_icon_${rank}.png`;
}

export function getIconPath(rank: string) {
  return `./src/images/ranks/${getIconFileName(rank)}`;
}

export function getAllIcons(): string[] {
  const icons = fs.readdirSync("./src/images/ranks/");
  const names = icons.map((name) => name.match(/Clan_icon_(.*)\.png/)![1]!);
  return names;
}
