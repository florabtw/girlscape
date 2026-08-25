import type { PlayerRank } from "#types/rank";
import { getRankIcon } from "./icon";

export const EMPTY_RSN = "————————————";

export function generateEmptyPlayer(rank: number): PlayerRank {
  return {
    collections: { list: [], points: 0 },
    events: { list: [], points: 0 },
    milestones: { list: [], points: 0 },
    progress: { ehp: 0, ehb: 0, eh: 0, rank: 0 },
    raids: { list: [], points: 0 },
    summary: {
      deductions: { list: [], ranks: 0 },
      displacements: [],
      rank: { current: rank, icon: getRankIcon(rank)!, potential: rank },
      points: 0,
      progress: 0,
    },
    rsn: EMPTY_RSN,
  };
}
