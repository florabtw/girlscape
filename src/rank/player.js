import temple from "#rank/temple.js";

// ------------ EFFICIENT HOURS ------------

// Ranks 1-12 by EHP+EHB
const EH_RANKS = [25, 50, 75, 100, 200, 300, 400, 500, 1000, 1500, 2000, 2500];

// Returns base EH Rank (1 to 12)
function getEHRank({ stats }) {
  const ehpKey = stats.info.Primary_ehp;
  const ehbKey = stats.info.Primary_ehb;

  const efficientHours = stats[ehpKey] + stats[ehbKey];
  let ehRank = EH_RANKS.findIndex((val) => val > efficientHours);

  if (ehRank < 0) ehRank = 12; // max EHP+EHB

  return { value: efficientHours, rank: ehRank };
}

// ---------- MILESTONES --------------

const hasBaseStats =
  (target) =>
  ({ levels }) => {
    const isBase = levels.every(([_key, level]) => level >= target);
    return isBase ? 1 : 0;
  };

const hasItem =
  (item) =>
  ({ clogs }) => {
    return clogs.includes(item);
  };

const hasSkillCape = ({ levels }) =>
  levels.some(([_key, level]) => level == 99);

const isEntryRaider = ({ stats }) =>
  stats["Tombs of Amascut"] >= 10 &&
  stats["Theatre of Blood"] >= 10 &&
  stats["Chambers of Xeric"] >= 10;

const isExpertRaider = ({ stats }) =>
  stats["Tombs of Amascut Expert"] >= 100 &&
  stats["Theatre of Blood"] >= 100 &&
  stats["Chambers of Xeric"] >= 100;

const isMaxRaider = ({ stats, clogs }) =>
  stats["Tombs of Amascut Expert"] >= 100 &&
  stats["Theatre of Blood Challenge Mode"] >= 100 &&
  stats["Chambers of Xeric Challenge Mode"] >= 100 &&
  hasItem("Cursed phalanx")({ clogs });

const milestonesAvailable = [
  { name: "Champion's Cape", fn: hasItem("Champion's cape"), value: 2 },
  { name: "Fire cape", fn: hasItem("Fire cape"), value: 2 },
  { name: "Infernal cape", fn: hasItem("Infernal cape"), value: 5 },
  // Quest cape
  // Music cape
  // All medium diaries
  // All hard diaries
  // Achievement Diary cape
  { name: "Base 70s", fn: hasBaseStats(70), value: 1 },
  { name: "Base 80s", fn: hasBaseStats(80), value: 1 },
  { name: "Base 90s", fn: hasBaseStats(90), value: 1 },
  { name: "First 99", fn: hasSkillCape, value: 2 },
  { name: "Maxed", fn: hasBaseStats(99), value: 2 },
  // Blood Torva
  // Hard  CA
  // Elite CA
  // Master CA
  // Grandmaster CA
  // Radiant Oathplate
  {
    name: "Dizana's Quiver",
    fn: hasItem("Dizana's quiver (uncharged)"),
    value: 3,
  },
  { name: "Entry Raider", fn: isEntryRaider, value: 1 },
  { name: "Expert Raider", fn: isExpertRaider, value: 2 },
  { name: "Max Raider", fn: isMaxRaider, value: 4 },
];

function getMilestones({ clogs, levels, stats }) {
  let points = [];
  for (const { name, fn, value } of milestonesAvailable) {
    const hasRequirement = fn({ clogs, levels, stats });
    if (hasRequirement) points.push({ name, value });
  }
  return points;
}

const POINTS_RANKS = [2, 4, 6, 8, 10, 15, 20, 25, 35, 40, 45, 50];

function getPointsRank(pointTotal) {
  const rank = POINTS_RANKS.findIndex((value) => pointTotal < value);

  if (rank < 0) return 12; // max rank
  return rank;
}

function getMilestoneTotal(milestones) {
  return milestones.reduce((prev, { value }) => prev + value, 0);
}

// --------- CLOGS -------------

function getClogPoints({ pets, stats }) {
  const clogPoints = Math.floor(stats.Collections / 100);
  const petPoints = Math.floor(pets.length / 5);
  const hasOnePet = pets.length >= 1;
  const hasAllPets = pets.length == 67;

  return [
    { name: "Collection Log", value: clogPoints },
    { name: "Pets", value: petPoints },
    { name: "First Pet", value: Number(hasOnePet) },
    { name: "All Pets", value: Number(hasAllPets) },
  ];
}

function getClogPointTotal(items) {
  return items.reduce((prev, { value }) => prev + value, 0);
}

// --------- EXPORTS --------------
function getLevels({ stats }) {
  return Object.entries(stats).filter(
    ([key]) => key.endsWith("level") && key !== "Overall_level",
  );
}
async function rank(rsn) {
  const stats = await temple.getPlayerStats(rsn);
  const { clogs, pets } = await temple.getPlayerClogs(rsn);
  const levels = getLevels({ stats });

  // efficient hours
  const efficientHours = getEHRank({ stats });

  // milestones
  const milestones = getMilestones({ clogs, levels, stats });
  const milestonesTotal = getMilestoneTotal(milestones);
  const milestonesRank = getPointsRank(milestonesTotal);

  // clogs
  const collectionLogs = getClogPoints({ pets, stats });
  const clogPointTotal = getClogPointTotal(collectionLogs);

  // totals
  const pointTotal = milestonesTotal + clogPointTotal;
  const pointsRank = getPointsRank(pointTotal);
  const rank = efficientHours.rank + pointsRank;

  return {
    collectionLogs: {
      items: collectionLogs,
      total: clogPointTotal,
    },
    efficientHours,
    milestones: {
      items: milestones,
      total: milestonesTotal,
      rank: milestonesRank,
    },
    total: {
      points: pointTotal,
      pointsRank: pointsRank,
      rank,
    },
    rsn: stats.info.Username,
  };
}

export default {
  rank,
};
