#!/usr/bin/env node

/**
 * Regenerate the example images in media/examples
 * Usage: node generate-all-themes.js [username] [year]
 *
 * Writes one SVG per theme plus the variants the README and docs show.
 * output-github.png is also written because social link previews
 * (og:image, twitter:image) need a raster image.
 */

import "dotenv/config";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  fetchContributions,
  parseContributionsData,
} from "./src/api-client.js";
import { exportToPNG, renderWithStats, setTheme } from "./src/renderer.js";
import { renderSVG } from "./src/svg-renderer.js";
import { THEMES } from "./src/theme-config.js";

const username = process.argv[2] || "spectrewolf8";
const year = process.argv[3] ? Number.parseInt(process.argv[3], 10) : 2025;
const outputDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "media",
  "examples",
);

function save(file, data) {
  writeFileSync(join(outputDir, file), data);
  const sizeKB = (Buffer.byteLength(data) / 1024).toFixed(1);
  console.log(`✓ ${file} (${sizeKB} KB)`);
}

try {
  console.log(`Fetching contribution data for ${username} (${year})...`);
  const yearDays = parseContributionsData(
    await fetchContributions(username, year),
  );
  console.log("Fetching 365-day rolling window...");
  const rollingDays = parseContributionsData(
    await fetchContributions(username, "none"),
    true,
  );
  console.log("");

  // One example per theme, with stats and credit
  for (const [themeName, theme] of Object.entries(THEMES)) {
    setTheme(theme);
    save(
      `output-${themeName}.svg`,
      renderSVG(yearDays, { stats: true, username }),
    );
  }

  // Variants, all on the default GitHub theme
  setTheme(THEMES.github);
  save("output.svg", renderSVG(yearDays, { stats: true, username }));
  save("output-no-credit.svg", renderSVG(yearDays, { stats: true }));
  save("output-not-stats.svg", renderSVG(yearDays));
  save(
    "output-rolling-window.svg",
    renderSVG(rollingDays, { stats: true, username }),
  );
  save(
    "output-github.png",
    exportToPNG(renderWithStats(yearDays, { username })),
  );

  console.log(`\n✓ Examples written to ${outputDir}`);
} catch (error) {
  console.error("\n✗ Error:", error.message);
  process.exit(1);
}
