import { hasItem } from "./utils.js";

const isEntryRaider = ({ stats }) =>
  stats.bosses["Tombs of Amascut"] >= 10 &&
  stats.bosses["Theatre of Blood"] >= 10 &&
  stats.bosses["Chambers of Xeric"] >= 10;

const isExpertRaider = ({ stats }) =>
  stats.bosses["Tombs of Amascut Expert"] >= 100 &&
  stats.bosses["Theatre of Blood"] >= 100 &&
  stats.bosses["Chambers of Xeric"] >= 100;

const isMasterRaider = ({ stats, collectionLog }) =>
  stats.bosses["Tombs of Amascut Expert"] >= 100 &&
  stats.bosses["Theatre of Blood Challenge Mode"] >= 100 &&
  stats.bosses["Chambers of Xeric Challenge Mode"] >= 100 &&
  hasItem("Cursed phalanx")({ collectionLog });

const raidLevelsAvailable = [
  { name: "Beginner Raider", fn: isEntryRaider, points: 1 },
  { name: "Expert Raider", fn: isExpertRaider, points: 2 },
  { name: "Master Raider", fn: isMasterRaider, points: 4 },
];

function getRaidLevels({ collectionLog, stats }) {
  let raidLevels = [];
  for (let { name, fn, points } of raidLevelsAvailable) {
    const hasRequirement = fn({ collectionLog, stats });
    if (!hasRequirement) points = 0;
    raidLevels.push({ name, points });
  }
  return raidLevels;
}

function player({ levels, collectionLog, stats }) {
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
