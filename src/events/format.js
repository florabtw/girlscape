function info(event) {
  return `:trophy: **Event Name**: ${event.name}
:nerd: **Event ID**: ${event.id}
:woman_running_facing_right: **Players**: ${event.players.join(", ")}
:first_place: **Winners**: ${event.winners.join(", ")}`;
}

function summary(event) {
  return `- \`${event.id}\` — ${event.name}`;
}

function list(events) {
  if (events.length === 0) return "No events found!";

  return events.map(summary).join("\n");
}

function addPlayers(event, players) {
  const valids = players.filter((p) => p.valid).map((p) => p.player);
  const errors = players.filter((p) => !p.valid).map((p) => p.player);

  let message = `:white_check_mark: Added players to event \`${event.id}\`: ${valids.join(", ")}`;

  if (errors.length) {
    message += `\n:x: Players not found: ${errors.join(", ")}`;
  }

  return message;
}

function remPlayers(event, players) {
  const valids = players.filter((p) => p.valid).map((p) => p.player);
  const errors = players.filter((p) => !p.valid).map((p) => p.player);

  let message = `:white_check_mark: Removed players from event \`${event.id}\`: ${valids.join(", ")}`;

  if (errors.length) {
    message += `\n:x: Players not found: ${errors.join(", ")}`;
  }

  return message;
}

export default {
  addPlayers,
  info,
  list,
  remPlayers,
  summary,
};
