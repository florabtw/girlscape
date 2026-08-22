import type { RankFacet } from "#types/rank.js";
import type { PlayerClog, PlayerStats } from "#types/temple.js";
import { hasItem } from "./utils.js";

const isEntryRaider = ({ stats }: PlayerRaidsParams) =>
  stats.bosses["Tombs of Amascut"] >= 10 &&
  stats.bosses["Theatre of Blood"] >= 10 &&
  stats.bosses["Chambers of Xeric"] >= 10;

const isExpertRaider = ({ stats }: PlayerRaidsParams) =>
  stats.bosses["Tombs of Amascut Expert"] >= 100 &&
  stats.bosses["Theatre of Blood"] >= 100 &&
  stats.bosses["Chambers of Xeric"] >= 100;

const isMasterRaider = ({ stats, collectionLog }: PlayerRaidsParams) =>
  stats.bosses["Tombs of Amascut Expert"] >= 100 &&
  stats.bosses["Theatre of Blood Challenge Mode"] >= 100 &&
  stats.bosses["Chambers of Xeric Challenge Mode"] >= 100 &&
  hasItem("Cursed phalanx")({ collectionLog });

const raidLevelsAvailable = [
  { name: "Beginner Raider", fn: isEntryRaider, points: 1 },
  { name: "Expert Raider", fn: isExpertRaider, points: 3 },
  { name: "Master Raider", fn: isMasterRaider, points: 6 },
];

function getRaidLevels({ collectionLog, stats }: PlayerRaidsParams) {
  let raidLevels = [];
  for (let { name, fn, points } of raidLevelsAvailable) {
    const hasRequirement = fn({ collectionLog, stats });
    const score = hasRequirement ? points : 0;
    raidLevels.push({ name, points: score, pointsAvailable: points });
  }
  return raidLevels;
}

interface PlayerRaidsParams {
  stats: PlayerStats;
  collectionLog: PlayerClog;
}

function player({ collectionLog, stats }: PlayerRaidsParams): RankFacet {
  const list = getRaidLevels({ collectionLog, stats });
  const points = list.reduce((sum, { points }) => sum + points, 0);

  return {
    list,
    points,
  };
}

export default {
  player,
};
