import type { Feat, PlayerRank, RankSummary } from "#types/rank";

function formatList(list: Feat[]) {
  return list
    .map((item) => {
      const emoji = item.points ? ":green_circle:" : ":black_circle:";
      const points =
        "pointsAvailable" in item
          ? `${item.points} of ${item.pointsAvailable}`
          : item.points;

      return `${emoji} ${item.name}` + ` — ${points} points`;
    })
    .join("\n");
}

// Deductions + Displacements
function formatDeranks({
  summary: { deductions, displacements },
}: Pick<PlayerRank, "summary">) {
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

export default function player(player: PlayerRank) {
  const { collections, events, milestones, raids, rsn, summary } = player;

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

**Events:** ${events.points} points
${formatList(events.list)}
`;
}
