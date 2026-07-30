const Ranks = [
  "Burnt",
  "Illusionist",
  "Champion",
  "Explorer",
  "Specialist",
  "Trickster",
  "Zenyte",
  "Pure",
  "Adventurer",
  "Artisan",
  "Witch",
  "Red_Topaz",
  "Trialist",
  "Completionist",
  "Ignitor",
  "Warlock",
  "Dragonstone",
  "Hero",
  "Raider",
  "Legacy",
  "Seer",
  "Onyx",
  "Defiler",
  "Elite",
];

export function getRankIcon({ summary }) {
  const rank = summary.rank.current;
  const rankName = Ranks[Math.max(rank - 1, 0)];
  const fileName = `Rank_${rankName}.png`;
  const path = `./src/images/ranks/${fileName}`;
  return { path, fileName };
}
