export interface RankFacet<T extends Feat = Feat> {
  list: T[];
  points: number;
}

interface Feat {
  name: string;
  points: number;
}

export interface Milestone extends Feat {
  isDeductible: boolean;
  pointsAvailable: number;
}
