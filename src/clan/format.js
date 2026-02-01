function formatList(list) {
  return list
    .map((item) => {
      const emoji = item.points ? ":green_circle:" : ":black_circle:";
      return `${emoji} ${item.name}` + ` — ${item.points} points`;
    })
    .join("\n");
}

function formatDeductions({ summary: { deductions } }) {
  if (!deductions.ranks) return "";

  return `:small_red_triangle_down: Deductions — ${deductions.ranks}\n`;
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
:trophy: Rank — ${summary.rank}
:star: Points — ${summary.points}
:chart_with_upwards_trend: EHP/EHB — ${summary.progress}
${formatDeductions({ summary })}
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
