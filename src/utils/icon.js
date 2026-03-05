const Ranks = [
  "Burnt",
  "Illusionist",
  "Champion",
  "Explorer",
  "Specialist",
  "Trickster",
  "Councillor",
  "Pure",
  "Adventurer",
  "Artisan",
  "Witch",
  "Teacher",
  "Trialist",
  "Completionist",
  "Ignitor",
  "Warlock",
  "Assistant",
  "Hero",
  "Raider",
  "Legacy",
  "Seer",
  "Coordinator",
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
