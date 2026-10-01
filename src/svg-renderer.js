/**
 * Isometric Contribution Graph SVG Renderer
 * Vector version of the PNG renderer. Cubes are placed by the same
 * layoutChart(), and text is drawn as Segoe UI glyph outlines, so the SVG
 * looks identical to the PNG on every viewer's machine without loading fonts.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import opentype from "opentype.js";
import {
  calculateStats,
  getCubeColor,
  getStyleConfig,
  layoutChart,
} from "./renderer.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fontsDir = join(__dirname, "..", "fonts");

function loadFont(file) {
  const buffer = readFileSync(join(fontsDir, file));
  return opentype.parse(
    buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.length),
  );
}

// Every theme uses Segoe UI at 400 or 600, matching the fonts the PNG
// renderer registers. Glyphs Segoe UI lacks (the arrows in date ranges) come
// from the same Segoe UI Symbol subset the PNG renderer falls back to.
const FONTS = {
  regular: loadFont("Segoe UI.ttf"),
  bold: loadFont("Segoe UI Bold.ttf"),
  symbol: loadFont("Segoe UI Symbol Arrows.ttf"),
};
const FONT_KEYS = new Map([
  [FONTS.regular, "r"],
  [FONTS.bold, "b"],
  [FONTS.symbol, "s"],
]);
const LAYOUT = { kerning: true };

// Thin lines between tiles of equal height. In the PNG these are the side
// face of the tile behind showing through between the pixel-stepped tops.
const SEAM_WIDTH = 0.75;

const num = (n) => +n.toFixed(2);
const toHex = (argb) => `#${(argb & 0xffffff).toString(16).padStart(6, "0")}`;
const escapeXML = (text) =>
  String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * Collects text as outlined glyphs. Each glyph's path is defined once in
 * <defs> and placed with <use>, which keeps repeated digits cheap.
 */
function createTextWriter() {
  const glyphDefs = new Map();

  const fontFor = (weight) =>
    weight === "bold" || Number(weight) >= 600 ? FONTS.bold : FONTS.regular;

  // Split text into [font, text] runs by which font has each glyph
  function fontRuns(font, text) {
    const runs = [];
    for (const char of text) {
      const runFont = font.charToGlyphIndex(char) ? font : FONTS.symbol;
      const last = runs.at(-1);
      if (last && last[0] === runFont) last[1] += char;
      else runs.push([runFont, char]);
    }
    return runs;
  }

  function measure(text, style) {
    let width = 0;
    for (const [font, run] of fontRuns(fontFor(style.fontWeight), text)) {
      width += font.getAdvanceWidth(run, style.fontSize, LAYOUT);
    }
    return width;
  }

  function draw(text, x, y, style) {
    let uses = "";
    let cursor = x;
    for (const [font, run] of fontRuns(fontFor(style.fontWeight), text)) {
      const unitsPerEm = font.unitsPerEm;
      const key = FONT_KEYS.get(font);
      font.forEachGlyph(run, cursor, y, style.fontSize, LAYOUT, (glyph, gx, gy, size) => {
        const id = `iso-${key}${glyph.index}`;
        if (!glyphDefs.has(id)) {
          const d = glyph.getPath(0, 0, unitsPerEm).toPathData(0);
          glyphDefs.set(id, d ? `<path id="${id}" d="${d}"/>` : "");
        }
        if (glyphDefs.get(id)) {
          uses += `<use href="#${id}" transform="translate(${num(gx)} ${num(gy)}) scale(${+(size / unitsPerEm).toFixed(5)})"/>`;
        }
      });
      cursor += font.getAdvanceWidth(run, style.fontSize, LAYOUT);
    }
    return `<g fill="${escapeXML(style.color)}">${uses}</g>`;
  }

  /**
   * Write a line made of differently styled pieces
   * @param {Array} pieces - [{text, style, gap}], gap is space before the piece
   * @param {number} x - Left edge, or right edge when align is "end"
   * @param {number} y - Baseline
   * @param {string} align - "start" or "end"
   */
  function write(pieces, x, y, align = "start") {
    const widths = pieces.map((p) => measure(String(p.text), p.style));
    let cursor = x;
    if (align === "end") {
      cursor -= pieces.reduce((sum, p, i) => sum + (p.gap || 0) + widths[i], 0);
    }
    let out = "";
    pieces.forEach((piece, i) => {
      cursor += piece.gap || 0;
      out += draw(String(piece.text), cursor, y, piece.style);
      cursor += widths[i];
    });
    return out;
  }

  return { write, defs: () => [...glyphDefs.values()].join("") };
}

/**
 * Scale a theme text style for the current image size
 * @param {Object} style - Theme text style {color, fontSize, fontWeight}
 * @param {number} scale - Scale factor
 */
const scaled = (style, scale) => ({
  color: style.color,
  fontWeight: style.fontWeight,
  fontSize: style.fontSize * scale,
});

/**
 * Render the cubes as SVG paths, with seams between equal-height neighbours
 * @returns {Object} {css, markup}
 */
function renderCubes(layout) {
  const { offsetX, offsetY, cubeSize, cubeScale, cubes } = layout;
  // A tenth of a pixel is plenty for cube corners and keeps the file small
  const point = (n) => +n.toFixed(1);
  const project = (x, y, z) =>
    `${point(offsetX + x - y)},${point(offsetY + (x + y) / 2 - z)}`;

  // One CSS class set per distinct color instead of inline fills. Faces are
  // stroked in their own color to hide anti-aliasing gaps between them.
  const palette = new Map();
  let css = "";
  const classFor = (color) => {
    if (!palette.has(color)) {
      const i = palette.size;
      const shade = getCubeColor(color);
      const top = toHex(shade.horizontal);
      const left = toHex(shade.left);
      const right = toHex(shade.right);
      const seam = num(SEAM_WIDTH * cubeScale);
      css +=
        `.t${i}{fill:${top};stroke:${top}}` +
        `.l${i}{fill:${left};stroke:${left}}` +
        `.r${i}{fill:${right};stroke:${right}}` +
        `.sl${i}{fill:none;stroke:${left};stroke-width:${seam}px}` +
        `.sr${i}{fill:none;stroke:${right};stroke-width:${seam}px}`;
      palette.set(color, i);
    }
    return palette.get(color);
  };

  const grid = [];
  for (const cube of cubes) {
    if (!grid[cube.weekIndex]) grid[cube.weekIndex] = [];
    grid[cube.weekIndex][cube.dayIndex] = cube;
  }

  let markup = "";
  for (const cube of cubes) {
    const { x, y, height: h } = cube;
    const X = x + cubeSize;
    const Y = y + cubeSize;
    const c = classFor(cube.color);
    markup +=
      `<path class="l${c}" d="M${project(x, Y, 0)} ${project(X, Y, 0)} ${project(X, Y, h)} ${project(x, Y, h)}z"/>` +
      `<path class="r${c}" d="M${project(X, y, 0)} ${project(X, Y, 0)} ${project(X, Y, h)} ${project(X, y, h)}z"/>` +
      `<path class="t${c}" d="M${project(x, y, h)} ${project(X, y, h)} ${project(X, Y, h)} ${project(x, Y, h)}z"/>`;

    // The previous week sits up-left: its right face shows along our x edge
    const prevWeek = grid[cube.weekIndex - 1]?.[cube.dayIndex];
    if (prevWeek && prevWeek.height === h) {
      markup += `<path class="sr${classFor(prevWeek.color)}" d="M${project(x, y, h)} ${project(x, Y, h)}"/>`;
    }
    // The previous day sits up-right: its left face shows along our y edge
    const prevDay = grid[cube.weekIndex][cube.dayIndex - 1];
    if (prevDay && prevDay.height === h) {
      markup += `<path class="sl${classFor(prevDay.color)}" d="M${project(x, y, h)} ${project(X, y, h)}"/>`;
    }
  }

  return { css, markup };
}

/**
 * Render the stats boxes, mirroring renderWithStats() in renderer.js
 */
function renderStats(text, theme, stats, width, height, scale) {
  const dims = theme.dimensions;
  const margin = 25 * scale;

  // The canvas spec makes shadowBlur twice the Gaussian standard deviation,
  // but node-canvas's shadows measure about 10% wider, so match those.
  const boxStyle = theme.box;
  const dx = boxStyle.shadowOffsetX * scale;
  const dy = boxStyle.shadowOffsetY * scale;
  const blur = ((boxStyle.shadowBlur * scale) / 2) * 1.1;
  let boxCount = 0;

  const box = (title, x, y, boxWidth, boxHeight) => {
    const boxY = y + dims.titleHeight * scale;
    // The filter region is sized in pixels so the full blur fits around
    // the box; a percentage region clips large glows like the Neon theme's.
    const pad = 3 * blur + Math.max(Math.abs(dx), Math.abs(dy)) + boxStyle.borderWidth * scale;
    const id = `iso-shadow-${boxCount++}`;
    return (
      text.write([{ text: title, style: scaled(theme.title, scale) }], x, y + 16 * scale) +
      `<filter id="${id}" filterUnits="userSpaceOnUse" x="${num(x - pad)}" y="${num(boxY - pad)}" width="${num(boxWidth + 2 * pad)}" height="${num(boxHeight + 2 * pad)}"><feDropShadow dx="${num(dx)}" dy="${num(dy)}" stdDeviation="${num(blur)}" flood-color="${escapeXML(boxStyle.shadowColor)}"/></filter>` +
      `<rect x="${num(x)}" y="${num(boxY)}" width="${num(boxWidth)}" height="${num(boxHeight)}" rx="${num(boxStyle.borderRadius * scale)}" fill="${escapeXML(boxStyle.backgroundColor)}" stroke="${escapeXML(boxStyle.borderColor)}" stroke-width="${num(boxStyle.borderWidth * scale)}" filter="url(#${id})"/>`
    );
  };

  // Value, label and subtext stacked, like drawFlexStatItem()
  const item = (value, label, subtext, x, y) =>
    text.write([{ text: value, style: scaled(theme.value, scale) }], x, y + 22 * scale) +
    text.write([{ text: label, style: scaled(theme.label, scale) }], x, y + 38 * scale) +
    (subtext
      ? text.write([{ text: subtext, style: scaled(theme.subtext, scale) }], x, y + 54 * scale)
      : "");

  let out = "";

  // Contributions box (top right)
  const contribWidth = dims.contributionsBoxWidth * scale;
  const contribHeight = dims.contributionsBoxHeight * scale;
  const contribX = width - contribWidth - margin;
  const contribBoxY = margin + dims.titleHeight * scale;
  const contribItemY = contribBoxY + 12 * scale;
  out += box("Contributions", contribX, margin, contribWidth, contribHeight);
  out += item(stats.countTotal, "Total", stats.datesTotal, contribX + 16 * scale, contribItemY);
  out += item(stats.weekCountTotal, "This week", stats.weekDatesTotal, contribX + 130 * scale, contribItemY);
  const bestDayDate = stats.dateBest.includes(" ")
    ? stats.dateBest.split(" ").slice(0, 2).join(" ")
    : stats.dateBest;
  out += item(stats.maxCount, "Best day", bestDayDate, contribX + 250 * scale, contribItemY);

  // Average, below the box and right-aligned
  out += text.write(
    [
      { text: "Average:", style: scaled(theme.averageText, scale) },
      { text: stats.averageCount, style: scaled(theme.averageValue, scale), gap: 4 * scale },
      { text: "/ day", style: scaled(theme.averageUnit, scale), gap: 4 * scale },
    ],
    contribX + contribWidth,
    contribBoxY + contribHeight + dims.averageBottomMargin * scale,
    "end",
  );

  // Streaks box (bottom left)
  const streaksTotalHeight =
    dims.streaksBoxHeight + dims.titleHeight + dims.averageBottomMargin;
  const streaksY = height - streaksTotalHeight * scale - margin;
  const streaksItemY = streaksY + dims.titleHeight * scale + 12 * scale;
  out += box("Streaks", margin, streaksY, dims.streaksBoxWidth * scale, dims.streaksBoxHeight * scale);
  const longestDays = stats.streakLongest === 1 ? "day" : "days";
  out += item(`${stats.streakLongest} ${longestDays}`, "Longest", stats.datesLongest, margin + 16 * scale, streaksItemY);
  const currentDays = stats.streakCurrent === 1 ? "day" : "days";
  const currentValue =
    stats.streakCurrent === 0 ? "0 days" : `${stats.streakCurrent} ${currentDays}`;
  const currentSubtext =
    stats.streakCurrent === 0 ? "No current streak" : stats.datesCurrent;
  out += item(currentValue, "Current", currentSubtext, margin + 145 * scale, streaksItemY);

  return out;
}

/**
 * Render isometric contribution graph as an SVG document
 * @param {Array} days - Array of day objects with {date, count, color, week}
 * @param {Object} options - Rendering options
 * @param {number} options.width - Image width (default: 1000)
 * @param {number} options.height - Image height (default: 600)
 * @param {boolean} options.stats - Include the stats overlay (default: false)
 * @param {string} options.username - Username to display as credit (optional)
 * @param {Object} options.theme - Theme to render with (default: the theme set by setTheme)
 * @returns {string} SVG markup
 */
export function renderSVG(days, options = {}) {
  const {
    width = 1000,
    height = 600,
    stats = false,
    username = null,
    theme = getStyleConfig(),
  } = options;
  const scale = Math.min(width / 1000, height / 600);
  const layout = layoutChart(days, { width, height, theme });
  const cubes = renderCubes(layout);
  const text = createTextWriter();
  const summary = calculateStats(days);

  let overlay = stats ? renderStats(text, theme, summary, width, height, scale) : "";

  // Username credit, bottom right at half opacity like drawUsernameCredit()
  if (username) {
    const padding = 12 * scale;
    const style = {
      color: theme.subtext?.color || "#768390",
      fontWeight: "400",
      fontSize: 11 * scale,
    };
    overlay += `<g opacity=".5">${text.write([{ text: `@${username}`, style }], width - padding, height - padding, "end")}</g>`;
  }

  const title = `Isometric GitHub contribution graph${username ? ` for @${username}` : ""}: ${summary.countTotal} contributions`;

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="iso-title">` +
    `<title id="iso-title">${escapeXML(title)}</title>` +
    `<defs><style>${cubes.css}path{stroke-width:.5px;stroke-linejoin:round}</style>${text.defs()}</defs>` +
    cubes.markup +
    overlay +
    "</svg>"
  );
}
