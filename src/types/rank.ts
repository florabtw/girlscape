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
