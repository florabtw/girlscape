function apply({ milestones, rank }) {
  const deductions = milestones.list
    .filter((m) => m.isDeductible)
    .map(({ name, points }) => ({ name, points: points === 0 ? 1 : 0 }));

  const deductionTotal = deductions.reduce(
    (sum, { points }) => sum + points,
    0,
  );
  const rankCap = 24 - deductionTotal;
  const appliedDeductions = Math.max(0, rank - rankCap);

  return { list: deductions, ranks: appliedDeductions };
}

export default { apply };
