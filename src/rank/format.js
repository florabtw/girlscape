function formatItem({ name, value }) {
  return `- ${name} (${value} points)`;
}

function formatItems(items) {
  return items.map(formatItem).join("\n");
}

function formatRank({
  collectionLogs,
  efficientHours,
  milestones,
  rsn,
  total,
}) {
  return `**Clan Member:** ${rsn}

**Efficient Hours:** ${Math.floor(efficientHours.value)} EHP/EHB (${efficientHours.rank} ranks)

**Milestones:** ${milestones.total} points
${formatItems(milestones.items)}

**Collection Logging:** ${collectionLogs.total} points
${formatItems(collectionLogs.items)}

**Final Points:** ${total.points} (${total.pointsRank} ranks)
**Final Rank:** ${total.rank}
`;
}

export default {
  rank: formatRank,
};
