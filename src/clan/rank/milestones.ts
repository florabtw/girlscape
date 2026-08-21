import type { PlayerVerifieds } from "#types/db.js";
import type { PlayerClog, PlayerStats } from "#types/temple.js";
import { hasItem, hasVerified } from "./utils.js";

const hasBaseStats =
  (target: number) =>
  ({ skills }: { skills: PlayerSkills }) =>
    skills.every(([_key, level]) => level >= target);

const hasSkillCape = ({ skills }: { skills: PlayerSkills }) =>
  skills.some(([_key, level]) => level == 99);

const milestonesAvailable = [
  { name: "Champion's Cape", fn: hasItem("Champion's cape"), points: 2 },
  { name: "Fire cape", fn: hasItem("Fire cape"), points: 1 },
  {
    isDeductible: true,
    name: "Infernal cape",
    fn: hasItem("Infernal cape"),
    points: 5,
  },
  { name: "Base 70s", fn: hasBaseStats(70), points: 1 },
  { name: "Base 80s", fn: hasBaseStats(80), points: 1 },
  { name: "Base 90s", fn: hasBaseStats(90), points: 1 },
  { name: "First 99", fn: hasSkillCape, points: 2 },
  { name: "Maxed", fn: hasBaseStats(99), points: 2 },
  {
    isDeductible: true,
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
    isDeductible: true,
    name: "Grandmaster Combat Achievements",
    fn: hasVerified("cas_grandmaster"),
    points: 6,
  },
  {
    isDeductible: true,
    name: "Blood Torva",
    fn: hasVerified("blood_torva"),
    points: 3,
  },
  {
    isDeductible: true,
    name: "Radiant Oathplate",
    fn: hasVerified("radiant_oathplate"),
    points: 3,
  },
  {
    name: "Brutus Slippers",
    fn: hasVerified("brutus_slippers"),
    points: 2,
  },
];

type PlayerSkills = Array<[string, number]>;

type GetMilestonesParams = Omit<PlayerParams, "stats"> & {
  skills: PlayerSkills;
};

function getMilestones({
  collectionLog,
  skills,
  verifieds,
}: GetMilestonesParams) {
  let milestones = [];
  for (let { isDeductible, name, fn, points } of milestonesAvailable) {
    const hasRequirement = fn({ collectionLog, skills, verifieds });
    const score = hasRequirement ? points : 0;

    milestones.push({
      isDeductible,
      name,
      points: score,
      pointsAvailable: points,
    });
  }
  return milestones;
}

function getSkills(stats: PlayerStats): PlayerSkills {
  return Object.entries(stats.skills).filter(
    ([key]) => key.endsWith("level") && !key.startsWith("Overall"),
  );
}

interface PlayerParams {
  collectionLog: PlayerClog;
  stats: PlayerStats;
  verifieds: PlayerVerifieds | undefined;
}

function player({ collectionLog, stats, verifieds }: PlayerParams) {
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
