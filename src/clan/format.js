function formatList(list) {
  return list
    .map((item) => `- ${item.name} - ${item.points} points`)
    .join("\n");
}

function player({ rank, rsn }) {
  const { collections, milestones, progress, raids, summary } = rank;

  return `**${rsn}** ——— RANK ${summary.rank} ——— ${summary.points} POINTS ——— ${summary.progress} EHP/EHB

**Milestones:** ${milestones.points} points
${formatList(milestones.list)}

**Raiding:** ${raids.points} points
${formatList(raids.list)}

**Collection Logging:** ${collections.points} points
${formatList(collections.list)}
`;
}

export default {
  player,
};
