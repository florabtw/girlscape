import type { ClanEvent, ClanEventList } from "./events";

export type ClanVerifieds = Record<string, PlayerVerifieds>;

export type PlayerVerifieds = Record<string, boolean>;

export type PlayerIcons = Record<string, string>;
