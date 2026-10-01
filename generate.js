#!/usr/bin/env node

/**
 * CLI tool to generate isometric contribution graphs
 * Usage: node generate.js <username> [year] [output] [--stats] [--png]
 */

import "dotenv/config";
import { writeFileSync } from "node:fs";
import {
  fetchContributions,
  parseContributionsData,
} from "./src/api-client.js";
import {
  renderIsometricChart,
  renderWithStats,
  calculateStats,
  exportToPNG,
} from "./src/renderer.js";
import { renderSVG } from "./src/svg-renderer.js";

const args = process.argv.slice(2);
const username = args[0];
const year =
  args[1] && !args[1].startsWith("--") ? Number.parseInt(args[1], 10) : null;
const hasStatsFlag = args.includes("--stats");
const hasCreditFlag = args.includes("--credit");
const hasPngFlag = args.includes("--png");

// Parse width and height flags
const widthIndex = args.indexOf("--width");
const heightIndex = args.indexOf("--height");
const customWidth =
  widthIndex >= 0 && args[widthIndex + 1]
    ? Number.parseInt(args[widthIndex + 1], 10)
    : 1000;
const customHeight =
  heightIndex >= 0 && args[heightIndex + 1]
    ? Number.parseInt(args[heightIndex + 1], 10)
    : 600;

// Determine output filename
let output;
if (args.length >= 3 && !args[2].startsWith("--")) {
  output = args[2];
} else {
  output = `${username}-contributions.${hasPngFlag ? "png" : "svg"}`;
}
// SVG unless --png is passed or the output name ends in .png
const asSVG = !hasPngFlag && !output.toLowerCase().endsWith(".png");

if (!username) {
  console.error(
    "Usage: node generate.js <username> [year] [output] [--stats] [--credit] [--width W] [--height H]",
  );
  console.error(
    "Example: node generate.js spectrewolf8 2025 graph.svg --stats --credit --width 1920 --height 1080",
  );
  console.error("\nOptions:");
  console.error("  --stats          Include statistics overlay on the image");
  console.error("  --credit         Show username in bottom right corner");
  console.error(
    "  --png            Write a PNG instead of an SVG (also used for .png output names)",
  );
  console.error("  --width <px>     Canvas width in pixels (default: 1000)");
  console.error("  --height <px>    Canvas height in pixels (default: 600)");
  process.exit(1);
}

async function main() {
  try {
    console.log(`Fetching contribution data for ${username}...`);

    // Fetch data from API
    const data = await fetchContributions(username, year);
    const days = parseContributionsData(data);

    if (days.length === 0) {
      console.error("No contribution data found");
      process.exit(1);
    }

    console.log(`Parsed ${days.length} days of contribution data`);

    // Calculate statistics
    const stats = calculateStats(days);
    console.log("\n=== Statistics ===");
    console.log(`Total: ${stats.countTotal} contributions`);
    console.log(
      `Best day: ${stats.dateBest} (${stats.maxCount} contributions)`,
    );
    console.log(`Average: ${stats.averageCount} per day`);
    console.log(`Longest streak: ${stats.streakLongest} days`);
    console.log(`Current streak: ${stats.streakCurrent} days`);

    // Render isometric chart
    console.log("\nRendering isometric chart...");
    const renderOptions = {
      width: customWidth,
      height: customHeight,
      username: hasCreditFlag ? username : null,
    };

    if (asSVG) {
      const svg = renderSVG(days, { ...renderOptions, stats: hasStatsFlag });
      writeFileSync(output, svg);
      console.log(`\n✓ Successfully generated ${output}`);
      console.log(`  Size: ${(Buffer.byteLength(svg) / 1024).toFixed(1)} KB`);
      console.log(`  Dimensions: ${customWidth}x${customHeight}`);
      return;
    }

    const canvas = hasStatsFlag
      ? renderWithStats(days, renderOptions)
      : renderIsometricChart(days, renderOptions);

    if (hasStatsFlag) {
      console.log("✓ Statistics overlay included");
    }
    if (hasCreditFlag) {
      console.log("✓ Username credit included");
    }

    // Export to PNG
    console.log(`Exporting to ${output}...`);
    const buffer = exportToPNG(canvas);
    writeFileSync(output, buffer);

    console.log(`\n✓ Successfully generated ${output}`);
    console.log(`  Size: ${(buffer.length / 1024).toFixed(1)} KB`);
    console.log(`  Dimensions: ${canvas.width}x${canvas.height}`);
  } catch (error) {
    console.error("\n✗ Error:", error.message);
    process.exit(1);
  }
}

main();
