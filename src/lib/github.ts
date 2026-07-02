// Server-only GitHub API access for the GitHub Activity section.
// Fetched with ISR (revalidate: 1h) so the unauthenticated rate limit
// (60 req/h) is never a concern. Fails closed: any error returns null
// and the section simply doesn't render.

import { githubToken } from "@/lib/env";

const GITHUB_USER = "ghiberti85";
const REVALIDATE_SECONDS = 3600;

export interface GitHubRepo {
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  pushedAt: string;
}

export interface GitHubLanguage {
  name: string;
  count: number;
  percent: number;
}

export interface GitHubStats {
  profileUrl: string;
  publicRepos: number;
  followers: number;
  totalStars: number;
  languages: GitHubLanguage[];
  recentRepos: GitHubRepo[];
}

interface RawRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
}

interface RawUser {
  public_repos: number;
  followers: number;
  html_url: string;
}

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  const token = githubToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

export async function getGitHubStats(): Promise<GitHubStats | null> {
  try {
    const headers = buildHeaders();
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USER}`, {
        headers,
        next: { revalidate: REVALIDATE_SECONDS },
      }),
      fetch(
        `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`,
        { headers, next: { revalidate: REVALIDATE_SECONDS } }
      ),
    ]);
    if (!userRes.ok || !reposRes.ok) return null;

    const user = (await userRes.json()) as RawUser;
    const rawRepos = (await reposRes.json()) as RawRepo[];
    const ownRepos = rawRepos.filter((r) => !r.fork);

    const totalStars = ownRepos.reduce((sum, r) => sum + r.stargazers_count, 0);

    const languageCounts = new Map<string, number>();
    for (const repo of ownRepos) {
      if (!repo.language) continue;
      languageCounts.set(repo.language, (languageCounts.get(repo.language) ?? 0) + 1);
    }
    const totalWithLanguage = Array.from(languageCounts.values()).reduce((a, b) => a + b, 0);
    const languages: GitHubLanguage[] = Array.from(languageCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({
        name,
        count,
        percent: totalWithLanguage > 0 ? Math.round((count / totalWithLanguage) * 100) : 0,
      }));

    const recentRepos: GitHubRepo[] = ownRepos.slice(0, 5).map((r) => ({
      name: r.name,
      description: r.description,
      url: r.html_url,
      language: r.language,
      stars: r.stargazers_count,
      pushedAt: r.pushed_at,
    }));

    return {
      profileUrl: user.html_url,
      publicRepos: user.public_repos,
      followers: user.followers,
      totalStars,
      languages,
      recentRepos,
    };
  } catch {
    return null;
  }
}
