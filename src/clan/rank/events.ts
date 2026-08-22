import type { PlayerEvents } from "#types/events";
import type { RankFacet } from "#types/rank";

interface PlayerEventsParams {
  events: PlayerEvents;
}

function player({ events: { played, won } }: PlayerEventsParams): RankFacet {
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
