import Collections from "./collections.js";
import Milestones from "./milestones.js";
import Progress from "./progress.js";
import Raids from "./raids.js";

const POINTS_RANKS = [2, 4, 6, 8, 10, 15, 20, 25, 35, 40, 45, 50];

function getRank(points) {
  const rank = POINTS_RANKS.findIndex((val) => val > points);

  if (rank < 0) rank = 12; // max rank

  return rank;
}

function getSummary({ collections, milestones, progress, raids }) {
  const progressRank = progress.rank;
  const points = milestones.points + raids.points + collections.points;
  const pointsRank = getRank(points);

  const rank = progressRank + pointsRank;

  const deductions = milestones.list
    .filter((m) => m.isDeductible)
    .map(({ name, points }) => ({ name, points: points === 0 ? 1 : 0 }));

  const deductionTotal = deductions.reduce(
    (sum, { points }) => sum + points,
    0,
  );
  const rankCap = 24 - deductionTotal;
  const appliedDeductions = Math.max(0, rank - rankCap);

  return {
    deductions: {
      list: deductions,
      value: appliedDeductions,
    },
    rank: rank - appliedDeductions,
    points,
    progress: progress.eh,
  };
}

function player({ collectionLog, stats, pets, verifieds }) {
  const progress = Progress.player({ stats });
  const milestones = Milestones.player({ collectionLog, stats, verifieds });
  const raids = Raids.player({ collectionLog, stats });
  const collections = Collections.player({ pets, stats });

  const summary = getSummary({ collections, milestones, progress, raids });
  const rsn = stats.player_name_with_capitalization || stats.player;

  return {
    collections,
    milestones,
    progress,
    raids,
    summary,
    rsn,
  };
}

export default {
  player,
};
