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

export function getRankIcon({ summary }) {
  const rank = summary.rank.current;
  const rankName = Ranks[Math.max(rank - 1, 0)];
  const fileName = `Clan_icon_${rankName}.png`;
  const path = `./src/images/ranks/${fileName}`;
  return { path, fileName };
}
