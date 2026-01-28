import clan from "./clan.js";

(async () => {
  // await clan.update();
  const msg = await clan.rank("Dead Lone");
  console.log(msg);
})();
