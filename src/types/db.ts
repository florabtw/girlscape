import type { ClanEvent, ClanEventList } from "./events";

export type ClanVerifieds = Record<string, PlayerVerifieds>;

export type PlayerVerifieds = Record<string, boolean>;
