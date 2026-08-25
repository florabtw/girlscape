import Webhook from "#notify/webhook.js";
import { getRedisClient } from "#data/db.js";
import { EMPTY_RSN } from "#utils/player";

async function rankChange(players) {
  const db = await getRedisClient();
  const lastLeaderboard = await db.json.get("clan:leaderboard");

  db.json.set("clan:leaderboard", "$", players);

  if (!lastLeaderboard) return;

  for (const currentPlayer of players) {
    if (currentPlayer.rsn === EMPTY_RSN) continue;

    const lastPlayer = lastLeaderboard.find((p) => p.rsn === currentPlayer.rsn);

    const currentRank = currentPlayer.summary.rank.current;
    const lastRank = lastPlayer?.summary.rank.current;

    if (currentRank !== lastRank) {
      await Webhook.rankChange({ currentPlayer, lastPlayer });
    }
  }
}

export default {
  rankChange,
};
