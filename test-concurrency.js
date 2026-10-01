#!/usr/bin/env node

/**
 * Concurrency check for /api/graph themes.
 *
 * Fires overlapping requests with different themes at the real server and
 * checks each response (and the image uploaded to the cache) was rendered
 * with its own theme. Runs offline: GitHub and Supabase are stubbed through
 * fetch, and the slow user's GitHub response is delayed so the other requests
 * run in the middle of it, which is where a shared theme would leak.
 *
 * Also checks the cache-save log reflects a failed upload.
 *
 * Usage: node test-concurrency.js
 */

import { createServer } from "node:net";

const SUPABASE_URL = "http://supabase.test";
const YEAR = 2025;

// Pick a free port before the server module reads PORT.
const port = await new Promise((resolve) => {
  const srv = createServer().listen(0, () => {
    const { port } = srv.address();
    srv.close(() => resolve(port));
  });
});

// Set before importing server.js. dotenv doesn't override existing values.
Object.assign(process.env, {
  PORT: String(port),
  GITHUB_TOKEN: "test-token",
  SUPABASE_URL,
  SUPABASE_ANON_KEY: "test-key",
  SUPABASE_BUCKET_NAME: "test-bucket",
});

// ---------------------------------------------------------------------------
// fetch stub
// ---------------------------------------------------------------------------

const githubDelayMs = { alice: 600, dave: 300, erin: 450 }; // others: none
const uploads = new Map(); // username -> uploaded PNG buffer
let failUploads = false;

function fakeCalendar() {
  const days = [];
  for (let d = new Date(Date.UTC(YEAR, 0, 1)); d.getUTCFullYear() === YEAR; ) {
    const date = d.toISOString().slice(0, 10);
    let h = 0;
    for (const c of date) h = (h * 31 + c.charCodeAt(0)) % 1000;
    days.push({
      contributionCount: h % 3 === 0 ? 0 : h % 14,
      date,
      color: "#ebedf0",
      weekday: d.getUTCDay(),
    });
    d = new Date(d.getTime() + 24 * 60 * 60 * 1000);
  }
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push({ contributionDays: days.slice(i, i + 7) });
  }
  const totalContributions = days.reduce((s, d) => s + d.contributionCount, 0);
  return { totalContributions, weeks };
}

const json = (status, body) =>
  new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const realFetch = globalThis.fetch;
globalThis.fetch = async (input, init = {}) => {
  const url = typeof input === "string" ? input : input.url;
  const method = (init.method || "GET").toUpperCase();

  if (url.startsWith("https://api.github.com/graphql")) {
    const { query, variables } = JSON.parse(init.body);
    if (query.includes("viewer")) {
      return json(200, { data: { viewer: { login: "test" } } });
    }
    const delay = githubDelayMs[variables.username] ?? 0;
    await new Promise((r) => setTimeout(r, delay));
    return json(200, {
      data: {
        user: {
          contributionsCollection: { contributionCalendar: fakeCalendar() },
        },
      },
    });
  }

  if (url.startsWith(SUPABASE_URL)) {
    if (url.includes("/storage/v1/object/") && method === "GET") {
      return json(400, {
        statusCode: "404",
        error: "not_found",
        message: "Object not found",
      });
    }
    if (url.includes("/storage/v1/object/")) {
      if (failUploads) {
        return json(400, {
          statusCode: "403",
          error: "Unauthorized",
          message: "new row violates row-level security policy",
        });
      }
      const username = decodeURIComponent(url).split("/").at(-2);
      const body =
        init.body instanceof Blob ? await init.body.arrayBuffer() : init.body;
      uploads.set(username, Buffer.from(body));
      return json(200, { Id: username, Key: url });
    }
    return json(201); // analytics insert
  }

  return realFetch(input, init);
};

// ---------------------------------------------------------------------------
// Log capture (server logs still print)
// ---------------------------------------------------------------------------

const logs = [];
for (const level of ["log", "error"]) {
  const original = console[level].bind(console);
  console[level] = (...args) => {
    logs.push(args.join(" "));
    original(...args);
  };
}

async function waitForLog(predicate, timeoutMs = 3000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const line = logs.find(predicate);
    if (line) return line;
    await new Promise((r) => setTimeout(r, 25));
  }
  return null;
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

await import("./server.js");
const { fetchContributions, parseContributionsData } = await import(
  "./src/api-client.js"
);
const { renderWithStats, exportToPNG } = await import("./src/renderer.js");
const { renderSVG } = await import("./src/svg-renderer.js");
const { THEMES } = await import("./src/theme-config.js");

const base = `http://localhost:${port}`;
for (let i = 0; i < 100; i++) {
  try {
    if ((await realFetch(`${base}/health`)).ok) break;
  } catch {}
  await new Promise((r) => setTimeout(r, 50));
}

// Reference render for a theme, computed outside the server.
const data = await fetchContributions("reference", YEAR);
const days = parseContributionsData(data, false);
const expected = (theme, format = "png") => {
  const options = { width: 1000, height: 600, username: null, theme };
  return format === "svg"
    ? Buffer.from(renderSVG(days, { ...options, stats: true }), "utf8")
    : exportToPNG(renderWithStats(days, options));
};

async function request(username, theme, format = "png") {
  const res = await realFetch(
    `${base}/api/graph?username=${username}&theme=${theme}&year=${YEAR}&stats=true&format=${format}`,
  );
  if (!res.ok) throw new Error(`${username}: HTTP ${res.status} ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}

let failures = 0;
function check(ok, message) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${message}`);
  if (!ok) failures++;
}

console.log("\n--- overlapping requests with different themes ---");
// alice is slow at GitHub, so the others set up and render in the middle of
// alice's request. dave's theme name is unknown and must fall back to github,
// not inherit whichever theme another request used last. erin covers SVG.
const cases = [
  { username: "alice", theme: "sakura", want: THEMES.sakura },
  { username: "bob", theme: "dark", want: THEMES.dark },
  { username: "dave", theme: "doesnotexist", want: THEMES.github },
  { username: "erin", theme: "neon", want: THEMES.neon, format: "svg" },
];
const results = await Promise.all(
  cases.map((c) => request(c.username, c.theme, c.format)),
);

// Each case must differ from what any other case's theme would produce.
for (const c of cases) {
  const others = cases.filter((o) => o.want !== c.want);
  const mine = expected(c.want, c.format);
  check(
    others.every((o) => !expected(o.want, c.format).equals(mine)),
    `${c.username} reference image differs from the other themes`,
  );
}

for (const [i, c] of cases.entries()) {
  const want = expected(c.want, c.format);
  const label = `${c.username} (theme=${c.theme}, ${c.format ?? "png"})`;
  check(results[i].equals(want), `${label} response uses its own theme`);
  const saveLine = await waitForLog(
    (l) => l.includes(c.username) && l.includes("cached to Supabase"),
  );
  check(Boolean(saveLine), `${c.username} logs [SAVE] after a successful upload`);
  check(
    uploads.get(c.username)?.equals(want) ?? false,
    `${c.username} cached image uses its own theme`,
  );
}

console.log("\n--- failed cache upload ---");
failUploads = true;
await request("carol", "ocean");
const outcome = await waitForLog(
  (l) => l.includes("carol") && /\[(SAVE|ERROR)\]/.test(l),
);
check(
  Boolean(outcome?.includes("[ERROR]") && outcome.includes("cache save failed")),
  `carol logs the failed upload (got: ${outcome ?? "nothing"})`,
);
check(
  !logs.some((l) => l.includes("carol") && l.includes("cached to Supabase")),
  "carol does not log [SAVE] when the upload failed",
);

console.log(failures ? `\n${failures} check(s) failed` : "\nAll checks passed");
process.exit(failures ? 1 : 0);
