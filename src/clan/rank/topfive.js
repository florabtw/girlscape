function apply(ranks) {
  let i = 0;
  let j = 1;

  while (ranks[i].summary.rank.current > 19 && i < ranks.length) {
    while (
      ranks[i].summary.rank.current === ranks[j].summary.rank.current &&
      j < ranks.length
    ) {
      let player = ranks[j];

      const displacements = player.summary.displacements || [];
      displacements.push({ name: ranks[i].rsn });

      player.summary.displacements = displacements;
      player.summary.rank.current--;

      j++;
    }

    i++;
  }

  return ranks;
}

export default { apply };
