/**
 * Theme Configuration
 * Predefined color schemes for different visual styles
 */

/**
 * GitHub Style (Default)
 * Matches GitHub's contribution graph styling
 */
export const GITHUB_THEME = {
  title: {
    color: "#24292f",
    fontFamily: "Segoe UI",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
  },
  value: {
    color: "#2BD853",
    fontFamily: "Segoe UI",
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 30,
  },
  label: {
    color: "#ffffff",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 18,
  },
  subtext: {
    color: "#b7bdc8",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 18,
  },
  averageText: {
    color: "#24292f",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "400",
  },
  averageValue: {
    color: "#2ea043",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "600",
  },
  averageUnit: {
    color: "#57606a",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "400",
  },
  box: {
    backgroundColor: "rgb(22, 27, 34)",
    borderColor: "rgb(48, 54, 61)",
    borderWidth: 2,
    borderRadius: 8,
    shadowColor: "rgba(0, 0, 0, 0.4)",
    shadowBlur: 10,
    shadowOffsetX: 0,
    shadowOffsetY: 3,
  },
  graph: {
    colors: {
      level0: "#161b22",
      level1: "#0e4429",
      level2: "#006d32",
      level3: "#26a641",
      level4: "#39d353",
    },
  },
  dimensions: {
    contributionsBoxWidth: 316,
    contributionsBoxHeight: 84,
    streaksBoxWidth: 254,
    streaksBoxHeight: 80,
    titleHeight: 24,
    averageBottomMargin: 16,
  },
};

/**
 * Dark Theme
 * High contrast dark mode design
 */
export const DARK_THEME = {
  title: {
    color: "#e6edf3",
    fontFamily: "Segoe UI",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
  },
  value: {
    color: "#3fb950",
    fontFamily: "Segoe UI",
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 30,
  },
  label: {
    color: "#ffffff",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 18,
  },
  subtext: {
    color: "#8b949e",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 18,
  },
  averageText: {
    color: "#c9d1d9",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "400",
  },
  averageValue: {
    color: "#3fb950",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "600",
  },
  averageUnit: {
    color: "#8b949e",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "400",
  },
  box: {
    backgroundColor: "rgb(13, 17, 23)",
    borderColor: "rgb(48, 54, 61)",
    borderWidth: 2,
    borderRadius: 8,
    shadowColor: "rgba(0, 0, 0, 0.6)",
    shadowBlur: 12,
    shadowOffsetX: 0,
    shadowOffsetY: 4,
  },
  graph: {
    colors: {
      level0: "#0d1117",
      level1: "#0e4429",
      level2: "#006d32",
      level3: "#26a641",
      level4: "#39d353",
    },
  },
  dimensions: {
    contributionsBoxWidth: 316,
    contributionsBoxHeight: 84,
    streaksBoxWidth: 254,
    streaksBoxHeight: 80,
    titleHeight: 24,
    averageBottomMargin: 16,
  },
};

/**
 * Light Theme
 * Clean light mode design
 */
export const LIGHT_THEME = {
  title: {
    color: "#1f2328",
    fontFamily: "Segoe UI",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
  },
  value: {
    color: "#1a7f37",
    fontFamily: "Segoe UI",
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 30,
  },
  label: {
    color: "#24292f",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 18,
  },
  subtext: {
    color: "#656d76",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 18,
  },
  averageText: {
    color: "#1f2328",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "400",
  },
  averageValue: {
    color: "#1a7f37",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "600",
  },
  averageUnit: {
    color: "#656d76",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "400",
  },
  box: {
    backgroundColor: "rgb(255, 255, 255)",
    borderColor: "rgb(208, 215, 222)",
    borderWidth: 2,
    borderRadius: 8,
    shadowColor: "rgba(31, 35, 40, 0.15)",
    shadowBlur: 8,
    shadowOffsetX: 0,
    shadowOffsetY: 2,
  },
  graph: {
    colors: {
      level0: "#ebedf0",
      level1: "#9be9a8",
      level2: "#40c463",
      level3: "#30a14e",
      level4: "#216e39",
    },
  },
  dimensions: {
    contributionsBoxWidth: 316,
    contributionsBoxHeight: 84,
    streaksBoxWidth: 254,
    streaksBoxHeight: 80,
    titleHeight: 24,
    averageBottomMargin: 16,
  },
};

/**
 * Neon Theme
 * Vibrant cyberpunk-inspired colors
 */
export const NEON_THEME = {
  title: {
    color: "#4d0099",
    fontFamily: "Segoe UI",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
  },
  value: {
    color: "#ff00ff",
    fontFamily: "Segoe UI",
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 30,
  },
  label: {
    color: "#ffffff",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 18,
  },
  subtext: {
    color: "#a0a0ff",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 18,
  },
  averageText: {
    color: "#4d0099",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "400",
  },
  averageValue: {
    color: "#ff00ff",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "600",
  },
  averageUnit: {
    color: "#a0a0ff",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "400",
  },
  box: {
    backgroundColor: "rgb(10, 10, 30)",
    borderColor: "rgb(255, 0, 255)",
    borderWidth: 2,
    borderRadius: 8,
    shadowColor: "rgba(255, 0, 255, 0.5)",
    shadowBlur: 15,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
  },
  graph: {
    colors: {
      level0: "#1a0033",
      level1: "#4d0099",
      level2: "#8000ff",
      level3: "#b366ff",
      level4: "#e600ff",
    },
  },
  dimensions: {
    contributionsBoxWidth: 316,
    contributionsBoxHeight: 84,
    streaksBoxWidth: 254,
    streaksBoxHeight: 80,
    titleHeight: 24,
    averageBottomMargin: 16,
  },
};

/**
 * Minimal Theme
 * Subtle, minimal design
 */
export const MINIMAL_THEME = {
  title: {
    color: "#333333",
    fontFamily: "Segoe UI",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
  },
  value: {
    color: "#000000",
    fontFamily: "Segoe UI",
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 30,
  },
  label: {
    color: "#666666",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 18,
  },
  subtext: {
    color: "#999999",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 18,
  },
  averageText: {
    color: "#333333",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "400",
  },
  averageValue: {
    color: "#000000",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "600",
  },
  averageUnit: {
    color: "#999999",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "400",
  },
  box: {
    backgroundColor: "rgb(255, 255, 255)",
    borderColor: "rgb(51, 51, 51)",
    borderWidth: 2,
    borderRadius: 8,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowBlur: 5,
    shadowOffsetX: 0,
    shadowOffsetY: 2,
  },
  graph: {
    colors: {
      level0: "#f5f5f5",
      level1: "#d4d4d4",
      level2: "#a3a3a3",
      level3: "#737373",
      level4: "#404040",
    },
  },
  dimensions: {
    contributionsBoxWidth: 316,
    contributionsBoxHeight: 84,
    streaksBoxWidth: 254,
    streaksBoxHeight: 80,
    titleHeight: 24,
    averageBottomMargin: 16,
  },
};

/**
 * Ocean Theme
 * Cool blue-teal color palette
 */
export const OCEAN_THEME = {
  title: {
    color: "#0891b2",
    fontFamily: "Segoe UI",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
  },
  value: {
    color: "#14b8a6",
    fontFamily: "Segoe UI",
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 30,
  },
  label: {
    color: "#f0f9ff",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 18,
  },
  subtext: {
    color: "#67e8f9",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 18,
  },
  averageText: {
    color: "#0891b2",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "400",
  },
  averageValue: {
    color: "#14b8a6",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "600",
  },
  averageUnit: {
    color: "#0e7490",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "400",
  },
  box: {
    backgroundColor: "rgb(7, 89, 133)",
    borderColor: "rgb(34, 211, 238)",
    borderWidth: 2,
    borderRadius: 8,
    shadowColor: "rgba(6, 182, 212, 0.3)",
    shadowBlur: 10,
    shadowOffsetX: 0,
    shadowOffsetY: 3,
  },
  graph: {
    colors: {
      level0: "#0c4a6e",
      level1: "#0e7490",
      level2: "#06b6d4",
      level3: "#22d3ee",
      level4: "#67e8f9",
    },
  },
  dimensions: {
    contributionsBoxWidth: 316,
    contributionsBoxHeight: 84,
    streaksBoxWidth: 254,
    streaksBoxHeight: 80,
    titleHeight: 24,
    averageBottomMargin: 16,
  },
};

/**
 * Catppuccin Theme (Mocha)
 * Soft pastel palette, lavender to mauve to pink
 */
export const CATPPUCCIN_THEME = {
  title: {
    color: "#cba6f7",
    fontFamily: "Segoe UI",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
  },
  value: {
    color: "#f5c2e7",
    fontFamily: "Segoe UI",
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 30,
  },
  label: {
    color: "#cdd6f4",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 18,
  },
  subtext: {
    color: "#a6adc8",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 18,
  },
  averageText: {
    color: "#cdd6f4",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "400",
  },
  averageValue: {
    color: "#a6e3a1",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "600",
  },
  averageUnit: {
    color: "#6c7086",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "400",
  },
  box: {
    backgroundColor: "rgb(30, 30, 46)",
    borderColor: "rgb(203, 166, 247)",
    borderWidth: 2,
    borderRadius: 8,
    shadowColor: "rgba(203, 166, 247, 0.3)",
    shadowBlur: 12,
    shadowOffsetX: 0,
    shadowOffsetY: 3,
  },
  graph: {
    colors: {
      level0: "#1e1e2e",
      level1: "#45475a",
      level2: "#b4befe",
      level3: "#cba6f7",
      level4: "#f5c2e7",
    },
  },
  dimensions: {
    contributionsBoxWidth: 316,
    contributionsBoxHeight: 84,
    streaksBoxWidth: 254,
    streaksBoxHeight: 80,
    titleHeight: 24,
    averageBottomMargin: 16,
  },
};

/**
 * Dracula Theme
 * The classic purple and pink dev palette
 */
export const DRACULA_THEME = {
  title: {
    color: "#bd93f9",
    fontFamily: "Segoe UI",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
  },
  value: {
    color: "#ff79c6",
    fontFamily: "Segoe UI",
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 30,
  },
  label: {
    color: "#f8f8f2",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 18,
  },
  subtext: {
    color: "#a1a8c9",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 18,
  },
  averageText: {
    color: "#f8f8f2",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "400",
  },
  averageValue: {
    color: "#50fa7b",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "600",
  },
  averageUnit: {
    color: "#6272a4",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "400",
  },
  box: {
    backgroundColor: "rgb(40, 42, 54)",
    borderColor: "rgb(189, 147, 249)",
    borderWidth: 2,
    borderRadius: 8,
    shadowColor: "rgba(189, 147, 249, 0.35)",
    shadowBlur: 14,
    shadowOffsetX: 0,
    shadowOffsetY: 3,
  },
  graph: {
    colors: {
      level0: "#282a36",
      level1: "#44475a",
      level2: "#6272a4",
      level3: "#bd93f9",
      level4: "#ff79c6",
    },
  },
  dimensions: {
    contributionsBoxWidth: 316,
    contributionsBoxHeight: 84,
    streaksBoxWidth: 254,
    streaksBoxHeight: 80,
    titleHeight: 24,
    averageBottomMargin: 16,
  },
};

/**
 * Crimson Theme
 * Bold ruby rising into a warm coral highlight
 */
export const CRIMSON_THEME = {
  title: {
    color: "#f43f5e",
    fontFamily: "Segoe UI",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
  },
  value: {
    color: "#ff7a8a",
    fontFamily: "Segoe UI",
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 30,
  },
  label: {
    color: "#fff1f2",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 18,
  },
  subtext: {
    color: "#d99aa4",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 18,
  },
  averageText: {
    color: "#fecdd3",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "400",
  },
  averageValue: {
    color: "#fda4af",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "600",
  },
  averageUnit: {
    color: "#b06a76",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "400",
  },
  box: {
    backgroundColor: "rgb(27, 15, 18)",
    borderColor: "rgb(225, 48, 80)",
    borderWidth: 2,
    borderRadius: 8,
    shadowColor: "rgba(225, 48, 80, 0.35)",
    shadowBlur: 14,
    shadowOffsetX: 0,
    shadowOffsetY: 3,
  },
  graph: {
    colors: {
      level0: "#1b0f12",
      level1: "#5b1526",
      level2: "#a11d33",
      level3: "#e23050",
      level4: "#ff7a8a",
    },
  },
  dimensions: {
    contributionsBoxWidth: 316,
    contributionsBoxHeight: 84,
    streaksBoxWidth: 254,
    streaksBoxHeight: 80,
    titleHeight: 24,
    averageBottomMargin: 16,
  },
};

/**
 * Tokyo Night Theme
 * Sleek deep navy rising into periwinkle and violet
 */
export const TOKYONIGHT_THEME = {
  title: {
    color: "#7aa2f7",
    fontFamily: "Segoe UI",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
  },
  value: {
    color: "#bb9af7",
    fontFamily: "Segoe UI",
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 30,
  },
  label: {
    color: "#c0caf5",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 18,
  },
  subtext: {
    color: "#7982a9",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 18,
  },
  averageText: {
    color: "#c0caf5",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "400",
  },
  averageValue: {
    color: "#9ece6a",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "600",
  },
  averageUnit: {
    color: "#565f89",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "400",
  },
  box: {
    backgroundColor: "rgb(26, 27, 38)",
    borderColor: "rgb(122, 162, 247)",
    borderWidth: 2,
    borderRadius: 8,
    shadowColor: "rgba(122, 162, 247, 0.3)",
    shadowBlur: 14,
    shadowOffsetX: 0,
    shadowOffsetY: 3,
  },
  graph: {
    colors: {
      level0: "#1a1b26",
      level1: "#292e42",
      level2: "#3d59a1",
      level3: "#7aa2f7",
      level4: "#bb9af7",
    },
  },
  dimensions: {
    contributionsBoxWidth: 316,
    contributionsBoxHeight: 84,
    streaksBoxWidth: 254,
    streaksBoxHeight: 80,
    titleHeight: 24,
    averageBottomMargin: 16,
  },
};

/**
 * Sunset Theme
 * Warm dusk gradient, plum to magenta to amber
 */
export const SUNSET_THEME = {
  title: {
    color: "#fb923c",
    fontFamily: "Segoe UI",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
  },
  value: {
    color: "#fbbf24",
    fontFamily: "Segoe UI",
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 30,
  },
  label: {
    color: "#fff7ed",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 18,
  },
  subtext: {
    color: "#f4b8a0",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 18,
  },
  averageText: {
    color: "#fdba74",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "400",
  },
  averageValue: {
    color: "#fbbf24",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "600",
  },
  averageUnit: {
    color: "#b06a8f",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "400",
  },
  box: {
    backgroundColor: "rgb(31, 17, 53)",
    borderColor: "rgb(249, 115, 22)",
    borderWidth: 2,
    borderRadius: 8,
    shadowColor: "rgba(251, 146, 60, 0.35)",
    shadowBlur: 14,
    shadowOffsetX: 0,
    shadowOffsetY: 3,
  },
  graph: {
    colors: {
      level0: "#1f1135",
      level1: "#6b2d6b",
      level2: "#c1436d",
      level3: "#f97316",
      level4: "#fbbf24",
    },
  },
  dimensions: {
    contributionsBoxWidth: 316,
    contributionsBoxHeight: 84,
    streaksBoxWidth: 254,
    streaksBoxHeight: 80,
    titleHeight: 24,
    averageBottomMargin: 16,
  },
};

/**
 * Sakura Theme
 * Soft light cherry-blossom pinks on white
 */
export const SAKURA_THEME = {
  title: {
    color: "#be185d",
    fontFamily: "Segoe UI",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 24,
  },
  value: {
    color: "#db2777",
    fontFamily: "Segoe UI",
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 30,
  },
  label: {
    color: "#831843",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 18,
  },
  subtext: {
    color: "#b06a8a",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 18,
  },
  averageText: {
    color: "#831843",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "400",
  },
  averageValue: {
    color: "#db2777",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "600",
  },
  averageUnit: {
    color: "#9f6b86",
    fontFamily: "Segoe UI",
    fontSize: 12,
    fontWeight: "400",
  },
  box: {
    backgroundColor: "rgb(255, 255, 255)",
    borderColor: "rgb(249, 168, 212)",
    borderWidth: 2,
    borderRadius: 8,
    shadowColor: "rgba(219, 39, 119, 0.15)",
    shadowBlur: 8,
    shadowOffsetX: 0,
    shadowOffsetY: 2,
  },
  graph: {
    colors: {
      level0: "#fdf2f8",
      level1: "#fbcfe8",
      level2: "#f9a8d4",
      level3: "#f472b6",
      level4: "#db2777",
    },
  },
  dimensions: {
    contributionsBoxWidth: 316,
    contributionsBoxHeight: 84,
    streaksBoxWidth: 254,
    streaksBoxHeight: 80,
    titleHeight: 24,
    averageBottomMargin: 16,
  },
};

/**
 * Available themes
 */
export const THEMES = {
  github: GITHUB_THEME,
  dark: DARK_THEME,
  light: LIGHT_THEME,
  neon: NEON_THEME,
  minimal: MINIMAL_THEME,
  ocean: OCEAN_THEME,
  catppuccin: CATPPUCCIN_THEME,
  dracula: DRACULA_THEME,
  crimson: CRIMSON_THEME,
  tokyonight: TOKYONIGHT_THEME,
  sunset: SUNSET_THEME,
  sakura: SAKURA_THEME,
};

/**
 * Get theme by name
 * @param {string} themeName - Name of the theme
 * @returns {Object} Theme configuration
 */
export function getTheme(themeName = "github") {
  return THEMES[themeName] || GITHUB_THEME;
}

/**
 * Normalize a hex color string to "#rrggbb", or null if invalid.
 * Accepts "#rgb", "rgb", "#rrggbb", "rrggbb".
 * @param {string} value
 * @returns {string|null}
 */
export function normalizeHex(value) {
  if (typeof value !== "string") return null;
  const s = value.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(s)) {
    return `#${s
      .split("")
      .map((c) => c + c)
      .join("")
      .toLowerCase()}`;
  }
  if (/^[0-9a-fA-F]{6}$/.test(s)) return `#${s.toLowerCase()}`;
  return null;
}

/**
 * Perceived luminance (0-255) of a normalized hex color.
 * @param {string} hex - "#rrggbb"
 * @returns {number}
 */
function luminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

/**
 * Build a theme from user-supplied colors. Starts from the GitHub theme layout
 * and overrides the cube ramp, box, and accent/text colors. Text colors that
 * the user does not provide are chosen for legibility against the box
 * background. Invalid or missing inputs fall back to sensible defaults, so this
 * never throws.
 *
 * @param {Object} opts
 * @param {string[]} [opts.colors] - 5 hex colors (level0..level4). Applied only if all 5 are valid.
 * @param {string} [opts.bg] - box background hex (default: darkest ramp color)
 * @param {string} [opts.border] - box border hex (default: brightest ramp color)
 * @param {string} [opts.accent] - title/value/average accent hex (default: brightest ramp color)
 * @param {string} [opts.label] - stat label hex (default: auto by background luminance)
 * @returns {Object} Theme configuration
 */
export function buildCustomTheme(opts = {}) {
  const theme = structuredClone(GITHUB_THEME);

  const ramp = (opts.colors || []).map(normalizeHex);
  if (ramp.length === 5 && ramp.every(Boolean)) {
    theme.graph.colors = {
      level0: ramp[0],
      level1: ramp[1],
      level2: ramp[2],
      level3: ramp[3],
      level4: ramp[4],
    };
  }

  const c = theme.graph.colors;
  const bg = normalizeHex(opts.bg) || c.level0;
  const border = normalizeHex(opts.border) || c.level4;
  const accent = normalizeHex(opts.accent) || c.level4;

  theme.box.backgroundColor = bg;
  theme.box.borderColor = border;

  const light = luminance(bg) > 140;
  theme.box.shadowColor = light ? "rgba(0, 0, 0, 0.15)" : "rgba(0, 0, 0, 0.4)";

  theme.title.color = accent;
  theme.value.color = accent;
  theme.averageValue.color = accent;

  theme.label.color = normalizeHex(opts.label) || (light ? "#1f2328" : "#ffffff");
  theme.subtext.color = light ? "#656d76" : "#b7bdc8";
  theme.averageText.color = light ? "#1f2328" : "#c9d1d9";
  theme.averageUnit.color = light ? "#656d76" : "#8b949e";

  return theme;
}
