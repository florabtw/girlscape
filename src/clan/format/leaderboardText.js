function summary({ rsn, summary }) {
  return (
    `${rsn.padEnd(12)}` +
    ` ——— RANK ${String(summary.rank.current).padEnd(2)}` +
    ` ——— ${String(summary.points).padStart(2)} POINTS` +
    ` ——— ${String(summary.progress).padStart(4)} EHP/EHB`
  );
}

export default function leaderboardText(players) {
  const summaries = players.map((player) => summary(player)).join("\n");
  return `\`\`\`${summaries}\`\`\``;
}
