const EHP_KEY = ["Ehp", "Ehp_im", "Uim_ehp", "Ehp_im"];
const EHB_KEY = ["Ehb", "Ehb_im", "Ehb_uim", "Ehb_im"];

// Ranks 1-12 by EHP+EHB
const EH_RANKS = [25, 50, 75, 100, 200, 300, 400, 500, 1000, 1500, 2000, 2500];

// Returns base EH Rank (1 to 12)
function player({ stats }) {
  const ehpKey = EHP_KEY[stats.game_mode];
  const ehbKey = EHB_KEY[stats.game_mode];

  const ehp = stats.skills[ehpKey];
  const ehb = stats.bosses[ehbKey];
  const eh = ehp + ehb;

  let rank = EH_RANKS.findIndex((val) => val > eh);

  if (rank < 0) rank = 12; // max EHP+EHB

  return {
    ehp: Math.floor(ehp),
    ehb: Math.floor(ehb),
    eh: Math.floor(eh),
    rank,
  };
}

export default {
  player,
};
