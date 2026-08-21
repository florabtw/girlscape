export type ClanEventList = Record<string, ClanEvent>;

export interface ClanEvent {
  id: string;
  name: string;
  players: string[];
  winners: string[];
}
