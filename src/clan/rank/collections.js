function player({ pets, stats }) {
  const clogPoints = Math.floor(stats.bosses.Collections / 100);

  const petPoints = pets ? Math.floor(pets.items.length / 5) : 0;
  const hasOnePet = pets ? pets.items.length >= 1 : false;
  const hasAllPets = pets ? pets.items.length == 67 : false;

  const list = [
    { name: "Collection Log", points: clogPoints },
    { name: "Pets", points: petPoints },
    { name: "First Pet", points: Number(hasOnePet) },
    { name: "All Pets", points: Number(hasAllPets) },
  ];

  const points = list.reduce((sum, { points }) => sum + points, 0);

  return {
    list,
    points,
  };
}

export default {
  player,
};
