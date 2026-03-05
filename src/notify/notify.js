import Webhook from "#notify/webhook.js";
import { getRedisClient } from "#data/db.js";

async function rankChange(players) {
  const db = await getRedisClient();
  const lastLeaderboard = await db.json.get("clan:leaderboard");

  db.json.set("clan:leaderboard", "$", players);

  if (!lastLeaderboard) return;

  for (const currentPlayer of players) {
    const lastPlayer = lastLeaderboard.find((p) => p.rsn === currentPlayer.rsn);

    if (
      currentPlayer.summary.rank.current !== lastPlayer.summary.rank.current
    ) {
      await Webhook.rankChange({ currentPlayer, lastPlayer });
    }
  }
}

export default {
  rankChange,
};
