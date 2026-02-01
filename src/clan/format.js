// ------------- RANK ------------

function formatList(list) {
  return list
    .map((item) => {
      const emoji = item.points ? ":green_circle:" : ":black_circle:";
      return `${emoji} ${item.name}` + ` — ${item.points} points`;
    })
    .join("\n");
}

// Deductions + Displacements
function formatDeranks({ summary: { deductions, displacements } }) {
  let msg = "";

  if (displacements?.length) {
    const formatted = displacements.map((d) => d.name).join(", ");
    msg += `:no_entry: Displaced by — ${formatted}\n`;
  }

  if (deductions.ranks) {
    msg += `:small_red_triangle_down: Missing milestones — ${deductions.ranks}\n`;
  }

  return msg;
}

function player(player) {
  const { collections, milestones, progress, raids, rsn, summary } = player;

  return `**Clan Member**: ${rsn}
:trophy: Rank — ${summary.rank.current} out of ${summary.rank.potential} potential
:star: Points — ${summary.points}
:chart_with_upwards_trend: EHP/EHB — ${summary.progress}
${formatDeranks({ summary })}
**Milestones:** ${milestones.points} points
${formatList(milestones.list)}

**Raiding:** ${raids.points} points
${formatList(raids.list)}

**Collection Logging:** ${collections.points} points
${formatList(collections.list)}
`;
}

// ------------- LEADERBOARD ------------

function summary({ rsn, summary }) {
  return (
    `${rsn.padEnd(12)}` +
    ` ——— RANK ${String(summary.rank.current).padEnd(2)}` +
    ` ——— ${String(summary.points).padStart(2)} POINTS` +
    ` ——— ${String(summary.progress).padStart(4)} EHP/EHB`
  );
}

function leaderboard(players) {
  const summaries = players.map((player) => summary(player)).join("\n");
  return `\`\`\`${summaries}\`\`\``;
}

// ------------- EXPORTS ------------

export default {
  leaderboard,
  player,
};
