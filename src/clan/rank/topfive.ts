import { getPlayerIcon } from "#data/db";
import type { PlayerRank } from "#types/rank";
import { getRankIcon } from "#utils/icon";
import { normalizeRsn } from "#utils/names";

async function apply(ranks: PlayerRank[]) {
  // apply displacements
  let i = 0;
  let j = 1;

  while (ranks[i]!.summary.rank.current < 6 && i < ranks.length) {
    while (
      ranks[i]!.summary.rank.current === ranks[j]!.summary.rank.current &&
      j < ranks.length
    ) {
      let player = ranks[j]!;

      const displacements = player.summary.displacements;
      displacements.push({ name: ranks[i]!.rsn });

      player.summary.displacements = displacements;
      player.summary.rank.current++;
      player.summary.rank.icon = getRankIcon(player.summary.rank.current)!;

      j++;
    }

    i++;
    j = i + 1;
  }

  // apply icons
  const taken = new Set();

  for (const player of ranks) {
    if (player.summary.rank.current > 5) continue;

    const playerName = normalizeRsn(player.rsn);
    const preferredIcon = await getPlayerIcon(playerName);

    if (!preferredIcon) continue;

    if (!taken.has(preferredIcon)) {
      taken.add(preferredIcon);
      player.summary.rank.icon = preferredIcon;
    }
  }

  return ranks;
}

export default { apply };
