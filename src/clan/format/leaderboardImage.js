import { AttachmentBuilder } from "discord.js";
import Canvas, { GlobalFonts, DOMMatrix } from "@napi-rs/canvas";

// function rankIcon({ summary }) {
//   const env = process.env.NODE_ENV || "development";
//   const rank = summary.rank.current;
//   return RankIcon[env][Math.max(rank - 1, 0)];
// }

const WIDTH = 800;

const TITLE_HEIGHT = 48;
const TITLE_LINE_HEIGHT = 60;

const HEADER_HEIGHT = 32;
const HEADER_LINE_HEIGHT = 40;

const TEXT_HEIGHT = 24;
const TEXT_LINE_HEIGHT = 32;

const PADDING_IN = 30;
const PADDING_X_OUT = 90;
const PADDING_Y_OUT = 60;

function renderBackground(canvas) {
  const context = canvas.getContext("2d");

  context.fillStyle = "#400B66";
  context.fillRect(0, 0, canvas.width, canvas.height);
}

function renderTitle(canvas) {
  const context = canvas.getContext("2d");

  context.font = `bold ${TITLE_HEIGHT}px DejaVu Sans Mono`;
  context.fillStyle = "white";

  const title = "GIRLSCAPE LEADERBOARD";
  const textWidth = context.measureText(title).width;

  // PADDING_X_OUT + textWidth / 2,
  context.fillText(
    title,
    PADDING_X_OUT + WIDTH / 2 - textWidth / 2,
    PADDING_Y_OUT + TITLE_HEIGHT,
  );
}

const columns = [
  {
    align: "left",
    header: "Player",
    value: (player) => player.rsn,
    width: (w) => w * 0.25,
  },
  {
    align: "right",
    header: "Rank",
    value: (player) => String(player.summary.rank.current).padStart(2),
    width: (w) => w * 0.25,
  },
  {
    align: "right",
    header: "Points",
    value: (player) => String(player.summary.points).padStart(2),
    width: (w) => w * 0.25,
  },
  {
    align: "right",
    header: "EHP/EHB",
    value: (player) => String(player.summary.progress).padStart(4),
    width: (w) => w * 0.25,
  },
];

function textAlign({ align, end, start, textWidth }) {
  if (align === "left") {
    return start;
  } else if (align === "center") {
    return start + (end - start) / 2 - textWidth / 2;
  } else if (align === "right") {
    return end - textWidth;
  }
}

function renderBoard(canvas, players) {
  const context = canvas.getContext("2d");

  context.font = `${TEXT_HEIGHT}px DejaVu Sans Mono`;
  context.fillStyle = "white";

  const xStart = PADDING_X_OUT;
  const yStart = PADDING_Y_OUT + TITLE_LINE_HEIGHT + PADDING_IN;

  let columnXStart = xStart;
  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    const columnWidth = column.width(WIDTH);
    let columnXEnd = columnXStart + columnWidth;

    // Header
    context.font = `bold ${HEADER_HEIGHT}px DejaVu Sans Mono`;
    const headerWidth = context.measureText(column.header).width;
    const headerX = textAlign({
      textWidth: headerWidth,
      align: column.align,
      start: columnXStart,
      end: columnXEnd,
    });
    const headerY = yStart + HEADER_HEIGHT;
    context.fillText(column.header, headerX, headerY);

    // Players
    context.font = `${TEXT_HEIGHT}px DejaVu Sans Mono`;
    for (let j = 0; j < players.length; j++) {
      const player = players[j];
      const text = column.value(player);
      const textWidth = context.measureText(text).width;
      const x = textAlign({
        textWidth,
        align: column.align,
        start: columnXStart,
        end: columnXEnd,
      });
      const y = yStart + HEADER_LINE_HEIGHT + (j + 1) * TEXT_LINE_HEIGHT;

      context.fillText(text, x, y);
    }

    // increment x
    columnXStart = columnXEnd;
  }
}

export default async function leaderboardImage(players) {
  const maxHeight =
    PADDING_Y_OUT +
    TITLE_LINE_HEIGHT +
    PADDING_IN +
    HEADER_LINE_HEIGHT + // Table Header
    players.length * TEXT_LINE_HEIGHT + // Players
    PADDING_Y_OUT;

  const canvas = Canvas.createCanvas(PADDING_X_OUT * 2 + WIDTH, maxHeight);

  renderBackground(canvas);
  renderTitle(canvas);
  renderBoard(canvas, players);

  const attachment = new AttachmentBuilder(await canvas.encode("png"), {
    name: "leaderboard.png",
  });

  return attachment;
}
