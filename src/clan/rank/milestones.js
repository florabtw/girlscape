import { hasItem, hasVerified } from "./utils.js";

const hasBaseStats =
  (target) =>
  ({ skills }) =>
    skills.every(([_key, level]) => level >= target);

const hasSkillCape = ({ skills }) =>
  skills.some(([_key, level]) => level == 99);

const milestonesAvailable = [
  { name: "Champion's Cape", fn: hasItem("Champion's cape"), points: 2 },
  { name: "Fire cape", fn: hasItem("Fire cape"), points: 1 },
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
  { name: "Quest Cape", fn: hasVerified("quest_cape"), points: 1 },
  { name: "Music Cape", fn: hasVerified("music_cape"), points: 2 },
  {
    name: "Achievement Diary Cape",
    fn: hasVerified("achievement_cape"),
    points: 3,
  },
  { name: "Medium Diaries", fn: hasVerified("diaries_medium"), points: 1 },
  { name: "Hard Diaries", fn: hasVerified("diaries_hard"), points: 2 },
  { name: "Hard Combat Achievements", fn: hasVerified("cas_hard"), points: 1 },
  {
    name: "Elite Combat Achievements",
    fn: hasVerified("cas_elite"),
    points: 2,
  },
  {
    name: "Master Combat Achievements",
    fn: hasVerified("cas_master"),
    points: 3,
  },
  {
    name: "Grandmaster Combat Achievements",
    fn: hasVerified("cas_grandmaster"),
    points: 6,
  },
  { name: "Blood Torva", fn: hasVerified("blood_torva"), points: 3 },
  {
    name: "Radiant Oathplate",
    fn: hasVerified("radiant_oathplate"),
    points: 3,
  },
];

function getMilestones({ collectionLog, skills, stats, verifieds }) {
  let milestones = [];
  for (let { name, fn, points } of milestonesAvailable) {
    const hasRequirement = fn({ collectionLog, skills, stats, verifieds });
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

function player({ collectionLog, stats, verifieds }) {
  const skills = getSkills(stats);
  const list = getMilestones({ collectionLog, skills, verifieds });
  const points = list.reduce((sum, { points }) => sum + points, 0);

  return {
    list,
    points,
  };
}

export default {
  player,
};
