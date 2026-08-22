// ------------- MILESTONES -----------

export interface PlayerMilestones {
  list: Milestone[];
  points: number;
}

export interface Milestone {
  isDeductible: boolean;
  name: string;
  points: number;
  pointsAvailable: number;
}
