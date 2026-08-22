// ----------- SHARED ----------------

interface BasePlayer {
  player: string;
  player_name_with_capitalization: string;
  game_mode: 0 | 1 | 2 | 3;
}

interface PlayerBosses {
  Collections: number;
  Ehb: number;
  Ehb_im: number;
  Ehb_uim: number;
  [key: string]: number;
}

interface PlayerSkills {
  Overall_level: number;
  Ehp: number;
  Ehp_im: number;
  Uim_ehp: number;
  [key: string]: number;
}

export interface TempleResponse<B> {
  data: B;
}

// CLAN RESPONSES
export type PlayerStats = BasePlayer & {
  skills: PlayerSkills;
  bosses: PlayerBosses;
};

export type ClanStats = Record<string, PlayerStats>;

export interface ClanStatsResponse {
  memberlist: ClanStats;
}

export type ClanClogRaw = {
  members: Array<BasePlayer & { items: number[] }>;
};

export type PlayerClog = BasePlayer & {
  items: Array<{ id: number; name: string }>;
};

export interface ClanClog {
  members: PlayerClog[];
}

// PLAYER DETAIL RESPONSES
export interface PlayerInfo {
  Username: string;
  "Game mode": 0 | 1 | 2 | 3;
  player_name_with_capitalization: string;
  [key: string]: any;
}

export type DetailPlayerStats = PlayerSkills & {
  info: PlayerInfo;
};

interface DetailPlayerClogItem {
  id: string;
  count: number;
  date: string;
}

type DetailPlayerClogItems = {
  all_pets: DetailPlayerClogItem[];
  [key: string]: DetailPlayerClogItem[];
};

export type DetailPlayerClog = BasePlayer & {
  items: DetailPlayerClogItems;
};
