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

  return {
    rank: progressRank + pointsRank,
    points,
    progress: progress.eh,
  };
}

function player({ collectionLog, stats, pets }) {
  const progress = Progress.player({ stats });
  const milestones = Milestones.player({ collectionLog, stats });
  const raids = Raids.player({ collectionLog, stats });
  const collections = Collections.player({ collectionLog, pets, stats });

  const summary = getSummary({ collections, milestones, progress, raids });

  return {
    collections,
    milestones,
    progress,
    raids,
    summary,
  };
}

export default {
  player,
};
