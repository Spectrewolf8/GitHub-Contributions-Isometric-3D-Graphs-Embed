/**
 * GitHub Contributions API Client
 * Uses GitHub's official GraphQL API (requires GITHUB_TOKEN env var)
 */

const GITHUB_GRAPHQL_API = "https://api.github.com/graphql";

const CONTRIBUTIONS_QUERY = `
query($username: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $username) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
            color
            weekday
          }
        }
      }
    }
  }
}`;

// Contribution totals for a window, plus how many were made in repositories
// the viewer can't see. When a user displays "Private contributions" on their
// profile, GitHub counts those anonymously for every viewer and reports the
// number in restrictedContributionsCount, so this mirrors the public profile.
const SUMMARY_QUERY = `
query($username: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $username) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        totalContributions
      }
      restrictedContributionsCount
    }
  }
}`;

/**
 * Fetch with retry and exponential backoff.
 * @param {string} url
 * @param {RequestInit} options
 * @param {number} retries
 * @returns {Promise<Response>}
 */
async function fetchWithRetry(url, options = {}, retries = 3) {
  let lastError;
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (response.status >= 500 || response.status === 429) {
        lastError = new Error(`HTTP ${response.status} ${response.statusText}`);
        if (attempt < retries - 1) {
          await new Promise((r) => setTimeout(r, 500 * 2 ** attempt));
          continue;
        }
        throw lastError;
      }
      return response;
    } catch (err) {
      lastError = err;
      if (attempt < retries - 1) {
        await new Promise((r) => setTimeout(r, 500 * 2 ** attempt));
      }
    }
  }
  throw lastError;
}

/**
 * Execute a GitHub GraphQL query.
 * @param {string} token
 * @param {string} username
 * @param {Date} from
 * @param {Date} to
 * @returns {Promise<Array>} flat array of day objects
 */
async function fetchGitHubGraphQL(token, username, from, to) {
  const fromStr = from.toISOString().slice(0, 10);
  const toStr = to.toISOString().slice(0, 10);
  console.log(`[GH]    ${username} — fetching ${fromStr} to ${toStr}`);

  const response = await fetchWithRetry(GITHUB_GRAPHQL_API, {
    method: "POST",
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: CONTRIBUTIONS_QUERY,
      variables: {
        username,
        from: from.toISOString(),
        to: to.toISOString(),
      },
    }),
  });

  if (!response.ok) {
    throw new Error(
      `GitHub API error: ${response.status} ${response.statusText}`,
    );
  }

  const json = await response.json();

  if (json.errors) {
    throw new Error(`GitHub GraphQL error: ${json.errors[0].message}`);
  }

  const calendar =
    json?.data?.user?.contributionsCollection?.contributionCalendar;
  if (!calendar) {
    throw new Error(
      `User "${username}" not found or contributions data unavailable`,
    );
  }

  const days = [];
  for (const week of calendar.weeks) {
    for (const day of week.contributionDays) {
      days.push({
        date: new Date(day.date),
        count: day.contributionCount,
        level: countToLevel(day.contributionCount),
        color: (day.color || "#ebedf0").replace("#", ""),
      });
    }
  }

  const total = calendar.totalContributions;
  console.log(`[GH]    ${username} — ${days.length} days, ${total} total contributions`);
  return { days, total };
}

/**
 * Assess whether a fetched calendar looks complete.
 *
 * GitHub reports an authoritative `totalContributions` for the requested
 * range. It also returns week-aligned days, so the sum of all returned day
 * counts is normally >= total (a few padding days from adjacent weeks may sit
 * outside the range). If the API partially fails it returns a truncated set of
 * weeks while `total` still reflects the full range, so `sum < total` is a
 * reliable signal that contribution days are missing. A day count far below
 * what the requested window should yield catches the rarer case where the
 * total itself came back truncated.
 *
 * @param {Array} days - flat day array from fetchGitHubGraphQL
 * @param {number} total - authoritative totalContributions
 * @param {number} expectedDays - days the requested window should cover
 * @returns {{complete: boolean, reason: string}}
 */
function assessCompleteness(days, total, expectedDays) {
  if (!days || days.length === 0) {
    return { complete: false, reason: "no days returned" };
  }

  const sum = days.reduce((acc, d) => acc + d.count, 0);
  if (sum < total) {
    return {
      complete: false,
      reason: `summed ${sum} < authoritative total ${total} (missing days)`,
    };
  }

  // Week alignment can add up to ~6 padding days, and timezones shift edges,
  // so allow a one-week grace below the expected window length.
  if (expectedDays > 0 && days.length < expectedDays - 7) {
    return {
      complete: false,
      reason: `only ${days.length} days for a ~${expectedDays}-day window`,
    };
  }

  return { complete: true, reason: "" };
}

/**
 * Map a contribution count to a level 0–4.
 * @param {number} count
 * @returns {number}
 */
function countToLevel(count) {
  if (count === 0) return 0;
  if (count <= 3) return 1;
  if (count <= 6) return 2;
  if (count <= 9) return 3;
  return 4;
}

/**
 * Summarize a user's contributions over the last 365 days (the same window
 * the default graph uses) as GitHub counts them for this viewer.
 *
 * This mirrors the public profile. If the user displays private contributions
 * there, GitHub counts them anonymously for every viewer and reports how many
 * in `restricted`; if not, they're excluded for everyone, profile included.
 * Either way `total` should equal the profile number. The one thing that
 * makes it lower is an organization whose token policy hides its repos from
 * the service token, and GitHub doesn't report that, so callers can explain
 * the possibility but cannot detect it.
 *
 * @param {string} username - GitHub username
 * @returns {Promise<{total: number, restricted: number, public: number, from: string, to: string}>}
 */
export async function fetchContributionSummary(username) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN environment variable is required.");

  const to = new Date();
  const from = new Date(to.getTime() - 364 * 24 * 60 * 60 * 1000);
  from.setHours(0, 0, 0, 0);

  const response = await fetchWithRetry(GITHUB_GRAPHQL_API, {
    method: "POST",
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: SUMMARY_QUERY,
      variables: { username, from: from.toISOString(), to: to.toISOString() },
    }),
  });

  if (!response.ok) {
    throw new Error(
      `GitHub API error: ${response.status} ${response.statusText}`,
    );
  }

  const json = await response.json();
  const collection = json?.data?.user?.contributionsCollection;
  if (!collection) {
    throw new Error(
      `User "${username}" not found or contributions data unavailable`,
    );
  }

  const total = collection.contributionCalendar.totalContributions;
  const restricted = collection.restrictedContributionsCount;
  return {
    total,
    restricted,
    public: total - restricted,
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

/**
 * Fetch contribution data for a GitHub user.
 *
 * @param {string} username - GitHub username
 * @param {number|string} year - Specific year, or "none" / null for 365-day rolling window
 * @returns {Promise<Object>} { _githubApiDays: Array, _total: number }.
 *   `_total` is GitHub's authoritative totalContributions for the window.
 */
export async function fetchContributions(username, year) {
  if (!username) throw new Error("Username is required");

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error(
      "GITHUB_TOKEN environment variable is required. " +
        "Create a GitHub personal access token (no scopes needed for public data) " +
        "and set it as GITHUB_TOKEN in your .env file.",
    );
  }

  const use365 = year === "none" || year === null || year === undefined;

  if (!use365 && Number.isNaN(Number.parseInt(year, 10))) {
    throw new Error("Year must be a number or 'none' for 365-day history");
  }

  let from;
  let to;
  if (use365) {
    to = new Date();
    from = new Date(to.getTime() - 364 * 24 * 60 * 60 * 1000);
    from.setHours(0, 0, 0, 0);
  } else {
    const y = Number.parseInt(year, 10);
    from = new Date(Date.UTC(y, 0, 1));
    to = new Date(Date.UTC(y, 11, 31, 23, 59, 59));
  }

  // GitHub only fills the calendar up to "now", so a current-year request
  // should only expect days up to today, not the whole year.
  const now = new Date();
  const effectiveTo = to > now ? now : to;
  const expectedDays =
    Math.round((effectiveTo - from) / (24 * 60 * 60 * 1000)) + 1;

  // The GraphQL API can return a 200 with a truncated calendar during partial
  // outages. Validate against GitHub's authoritative total and retry rather
  // than silently rendering low numbers; give up with a clear error so callers
  // return an error instead of a misleading graph.
  const maxAttempts = 3;
  let lastReason = "unknown";
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const { days, total } = await fetchGitHubGraphQL(token, username, from, to);
    const check = assessCompleteness(days, total, expectedDays);
    if (check.complete) {
      return { _githubApiDays: days, _total: total };
    }
    lastReason = check.reason;
    console.warn(
      `[WARN]  ${username} — incomplete data (attempt ${attempt}/${maxAttempts}): ${check.reason}`,
    );
    if (attempt < maxAttempts) {
      await new Promise((r) => setTimeout(r, 500 * 2 ** (attempt - 1)));
    }
  }

  throw new Error(
    `Incomplete contribution data for "${username}" after ${maxAttempts} attempts: ${lastReason}`,
  );
}

/**
 * Parse API response into a flat array of day objects with week numbers assigned.
 *
 * @param {Object} apiData - Value returned by fetchContributions()
 * @param {boolean} use365Days - Use relative week numbers (365-day mode)
 * @returns {Array<{date: Date, count: number, level: number, color: string, week: number}>}
 */
export function parseContributionsData(apiData, use365Days = false) {
  if (!apiData._githubApiDays) {
    throw new Error(
      "Unexpected API data format. Expected _githubApiDays from fetchContributions().",
    );
  }

  const days = [...apiData._githubApiDays].sort((a, b) => a.date - b.date);
  const startDate = use365Days ? (days[0]?.date ?? null) : null;

  for (const day of days) {
    if (use365Days && startDate) {
      const daysSinceStart = Math.floor(
        (day.date - startDate) / (24 * 60 * 60 * 1000),
      );
      day.week = Math.floor(daysSinceStart / 7);
    } else {
      const startOfYear = new Date(day.date.getFullYear(), 0, 1);
      const daysSinceStartOfYear = Math.floor(
        (day.date - startOfYear) / (24 * 60 * 60 * 1000),
      );
      day.week = Math.floor((daysSinceStartOfYear + startOfYear.getDay()) / 7);
    }
  }

  return days;
}

/**
 * Get contribution statistics summary.
 * @param {Object} apiData - Value returned by fetchContributions()
 * @returns {{ total: number, year: number, username: string }}
 */
export function getContributionStats(apiData) {
  const days = apiData._githubApiDays ?? [];
  // Prefer GitHub's authoritative total when present; fall back to summing.
  const total =
    apiData._total ?? days.reduce((s, d) => s + d.count, 0);
  return {
    total,
    year: new Date().getFullYear(),
    username: "",
  };
}
