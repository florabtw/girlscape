function formatList(list) {
  return list
    .map((item) => `- ${item.name} - ${item.points} points`)
    .join("\n");
}

function summary({ rsn, summary }) {
  return (
    `${rsn.padEnd(12)}` +
    ` ——— RANK ${String(summary.rank).padEnd(2)}` +
    ` ——— ${String(summary.points).padStart(2)} POINTS` +
    ` ——— ${String(summary.progress).padStart(4)} EHP/EHB`
  );
}

function player(rank) {
  const { collections, milestones, progress, raids, rsn, summary } = rank;

  return `**Clan Member**: ${rsn}
- Rank ${summary.rank}
- ${summary.points} points
- ${summary.progress} EHP/EHB

**Milestones:** ${milestones.points} points
${formatList(milestones.list)}

**Raiding:** ${raids.points} points
${formatList(raids.list)}

**Collection Logging:** ${collections.points} points
${formatList(collections.list)}
`;
}

function leaderboard(ranks) {
  const summaries = ranks.map(({ rank }) => summary(rank)).join("\n");
  return `\`\`\`${summaries}\`\`\``;
}

export default {
  leaderboard,
  player,
};
