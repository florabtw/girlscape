export interface RankFacet<T extends Feat = Feat> {
  list: T[];
  points: number;
}

interface Feat {
  name: string;
  points: number;
  pointsAvailable?: number;
}

export interface Milestone extends Feat {
  isDeductible: boolean;
}

export interface PlayerProgress {
  ehp: number;
  ehb: number;
  eh: number;
  rank: number;
}

export interface PlayerDeductions {
  list: Deduction[];
  ranks: number;
}

export type Deduction = Feat;

export interface RankSummary {
  deductions: PlayerDeductions;
  rank: { current: number; potential: number };
  points: number;
  progress: number;
}

export interface PlayerRank {
  collections: RankFacet;
  events: RankFacet;
  milestones: RankFacet<Milestone>;
  progress: PlayerProgress;
  raids: RankFacet;
  summary: RankSummary;
  rsn: string;
}
