import Collections from "./collections.js";
import Deductions from "./deductions.js";
import Events from "./events.js";
import Milestones from "./milestones.js";
import Progress from "./progress.js";
import Raids from "./raids.js";

const POINTS_RANKS = [2, 4, 6, 8, 10, 15, 20, 25, 35, 40, 45, 50];

function getRank(points) {
  let rank = POINTS_RANKS.findIndex((val) => val > points);

  if (rank < 0) rank = 12; // max rank

  return rank;
}

function getSummary({ collections, events, milestones, progress, raids }) {
  const progressRank = progress.rank;
  const points =
    collections.points + events.points + milestones.points + raids.points;
  const pointsRank = getRank(points);

  const potential = progressRank + pointsRank;

  const deductions = Deductions.apply({ milestones, rank: potential });
  const current = potential - deductions.ranks;

  return {
    deductions,
    rank: { current, potential },
    points,
    progress: progress.eh,
  };
}

function player({ collectionLog, events, pets, stats, verifieds }) {
  const events_ = Events.player({ events });
  const progress = Progress.player({ stats });
  const milestones = Milestones.player({ collectionLog, stats, verifieds });
  const raids = Raids.player({ collectionLog, stats });
  const collections = Collections.player({ pets, stats });

  const summary = getSummary({
    collections,
    events: events_,
    milestones,
    progress,
    raids,
  });

  const rsn = stats.player_name_with_capitalization || stats.player;

  return {
    collections,
    events: events_,
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
