import { getGitHubStats } from "@/lib/github";

const rawUser = {
  public_repos: 40,
  followers: 12,
  html_url: "https://github.com/ghiberti85",
};

const rawRepos = [
  {
    name: "repo-a",
    description: "A",
    html_url: "https://github.com/ghiberti85/repo-a",
    language: "TypeScript",
    stargazers_count: 10,
    pushed_at: "2026-06-30T12:00:00Z",
    fork: false,
  },
  {
    name: "repo-b",
    description: null,
    html_url: "https://github.com/ghiberti85/repo-b",
    language: "TypeScript",
    stargazers_count: 5,
    pushed_at: "2026-06-29T12:00:00Z",
    fork: false,
  },
  {
    name: "repo-c",
    description: "C",
    html_url: "https://github.com/ghiberti85/repo-c",
    language: "JavaScript",
    stargazers_count: 1,
    pushed_at: "2026-06-28T12:00:00Z",
    fork: false,
  },
  {
    name: "forked-repo",
    description: "fork",
    html_url: "https://github.com/ghiberti85/forked-repo",
    language: "Go",
    stargazers_count: 100,
    pushed_at: "2026-06-27T12:00:00Z",
    fork: true,
  },
];

function mockFetchOk() {
  global.fetch = jest.fn((url: RequestInfo | URL) => {
    const isRepos = String(url).includes("/repos");
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(isRepos ? rawRepos : rawUser),
    } as Response);
  }) as jest.Mock;
}

describe("getGitHubStats", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("maps user and repo data into stats", async () => {
    mockFetchOk();
    const stats = await getGitHubStats();
    expect(stats).not.toBeNull();
    expect(stats?.publicRepos).toBe(40);
    expect(stats?.followers).toBe(12);
    expect(stats?.profileUrl).toBe("https://github.com/ghiberti85");
  });

  it("excludes forks from stars, languages, and recent repos", async () => {
    mockFetchOk();
    const stats = await getGitHubStats();
    expect(stats?.totalStars).toBe(16);
    expect(stats?.recentRepos.map((r) => r.name)).not.toContain("forked-repo");
    expect(stats?.languages.map((l) => l.name)).not.toContain("Go");
  });

  it("computes language percentages sorted by usage", async () => {
    mockFetchOk();
    const stats = await getGitHubStats();
    expect(stats?.languages[0]).toEqual({ name: "TypeScript", count: 2, percent: 67 });
    expect(stats?.languages[1]).toEqual({ name: "JavaScript", count: 1, percent: 33 });
  });

  it("returns null when the user request fails", async () => {
    global.fetch = jest.fn((url: RequestInfo | URL) => {
      const isRepos = String(url).includes("/repos");
      return Promise.resolve({
        ok: isRepos,
        json: () => Promise.resolve(isRepos ? rawRepos : {}),
      } as Response);
    }) as jest.Mock;
    expect(await getGitHubStats()).toBeNull();
  });

  it("returns null when the repos request fails", async () => {
    global.fetch = jest.fn((url: RequestInfo | URL) => {
      const isRepos = String(url).includes("/repos");
      return Promise.resolve({
        ok: !isRepos,
        json: () => Promise.resolve(isRepos ? [] : rawUser),
      } as Response);
    }) as jest.Mock;
    expect(await getGitHubStats()).toBeNull();
  });

  it("returns null when fetch throws", async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error("network down"))) as jest.Mock;
    expect(await getGitHubStats()).toBeNull();
  });

  it("sends an Authorization header when GITHUB_TOKEN is set", async () => {
    process.env["GITHUB_TOKEN"] = "test-token";
    mockFetchOk();
    await getGitHubStats();
    const firstCall = (global.fetch as jest.Mock).mock.calls[0];
    expect(firstCall[1].headers["Authorization"]).toBe("Bearer test-token");
    delete process.env["GITHUB_TOKEN"];
  });
});
