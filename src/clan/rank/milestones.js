import { hasItem } from "./utils.js";

const hasBaseStats =
  (target) =>
  ({ skills }) =>
    skills.every(([_key, level]) => level >= target);

const hasSkillCape = ({ skills }) =>
  skills.some(([_key, level]) => level == 99);

const milestonesAvailable = [
  { name: "Champion's Cape", fn: hasItem("Champion's cape"), points: 2 },
  { name: "Fire cape", fn: hasItem("Fire cape"), points: 2 },
  { name: "Infernal cape", fn: hasItem("Infernal cape"), points: 5 },
  { name: "Base 70s", fn: hasBaseStats(70), points: 1 },
  { name: "Base 80s", fn: hasBaseStats(80), points: 1 },
  { name: "Base 90s", fn: hasBaseStats(90), points: 1 },
  { name: "First 99", fn: hasSkillCape, points: 2 },
  { name: "Maxed", fn: hasBaseStats(99), points: 2 },
  {
    name: "Dizana's Quiver",
    fn: hasItem("Dizana's quiver (uncharged)"),
    points: 3,
  },
  // Quest cape
  // Music cape
  // All medium diaries
  // All hard diaries
  // Achievement Diary cape
  // Blood Torva
  // Hard  CA
  // Elite CA
  // Master CA
  // Grandmaster CA
  // Radiant Oathplate
];

function getMilestones({ collectionLog, skills, stats }) {
  let milestones = [];
  for (let { name, fn, points } of milestonesAvailable) {
    const hasRequirement = fn({ collectionLog, skills, stats });
    if (!hasRequirement) points = 0;
    milestones.push({ name, points });
  }
  return milestones;
}

function getSkills(stats) {
  return Object.entries(stats.skills).filter(
    ([key]) => key.endsWith("level") && !key.startsWith("Overall"),
  );
}

function player({ collectionLog, stats }) {
  const skills = getSkills(stats);
  const list = getMilestones({ collectionLog, skills });
  const points = list.reduce((sum, { points }) => sum + points, 0);

  return {
    list,
    points,
  };
}

export default {
  player,
};
