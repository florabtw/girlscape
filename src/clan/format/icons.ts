import Canvas from "@napi-rs/canvas";
import { AttachmentBuilder } from "discord.js";

const WIDTH = 2000;

const TITLE_HEIGHT = 48;
const TITLE_LINE_HEIGHT = 60;

const TEXT_HEIGHT = 24;
const TEXT_LINE_HEIGHT = 36;

const PADDING_IN = 60;
const PADDING_X_OUT = 90;
const PADDING_Y_OUT = 60;

const NUM_COLUMNS = 6;

async function renderBackground(canvas: Canvas.Canvas) {
  const context = canvas.getContext("2d");

  context.fillStyle = "#ac9d81";
  context.fillRect(0, 0, canvas.width, canvas.height);
}

function renderTitle(canvas: Canvas.Canvas) {
  const context = canvas.getContext("2d");

  context.font = `bold ${TITLE_HEIGHT}px DejaVu Sans Mono`;
  context.fillStyle = "black";

  const title = "CLAN ICONS";
  const textWidth = context.measureText(title).width;

  // PADDING_X_OUT + textWidth / 2,
  context.fillText(
    title,
    PADDING_X_OUT + WIDTH / 2 - textWidth / 2,
    PADDING_Y_OUT + TITLE_HEIGHT,
  );
}

async function renderIcons(canvas: Canvas.Canvas, icons: string[]) {
  const context = canvas.getContext("2d");

  context.font = `${TEXT_HEIGHT}px DejaVu Sans Mono`;
  context.fillStyle = "black";

  let xStart = PADDING_X_OUT;
  let yStart = PADDING_Y_OUT + TITLE_LINE_HEIGHT + PADDING_IN;

  const rows = Math.floor(icons.length / 3);

  const columnWidth = WIDTH / NUM_COLUMNS;
  const rowHeight = TEXT_LINE_HEIGHT;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < NUM_COLUMNS; j++) {
      const index = i * NUM_COLUMNS + j;
      if (index >= icons.length) continue;

      const icon = icons[index]!;

      const file = `./src/images/ranks/Clan_icon_${icon}.png`;
      const image = await Canvas.loadImage(file);

      const x = xStart + j * columnWidth;
      const y = yStart + i * rowHeight;

      const iconHeight = 26;
      const iconWidth = 26;

      context.drawImage(
        image,
        x - 8,
        y - iconHeight + 4,
        iconWidth,
        iconHeight,
      );

      context.fillText(icon, x + iconWidth, y);
    }
  }
}

export default async function icons(icons: string[]) {
  const maxHeight =
    PADDING_Y_OUT +
    TITLE_LINE_HEIGHT +
    PADDING_IN +
    Math.floor(icons.length / NUM_COLUMNS) * TEXT_LINE_HEIGHT + // icons
    PADDING_Y_OUT;

  const canvas = Canvas.createCanvas(PADDING_X_OUT * 2 + WIDTH, maxHeight);

  renderBackground(canvas);
  renderTitle(canvas);
  await renderIcons(canvas, icons);

  const attachment = new AttachmentBuilder(await canvas.encode("png"), {
    name: "icons.png",
  });

  return attachment;
}
