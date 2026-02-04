function player({ events: { played, won } }) {
  const list = [
    { name: "Participated", points: played.length },
    { name: "Won", points: won.length },
  ];

  const points = played.length + won.length;

  return {
    list,
    points,
  };
}

export default {
  player,
};
