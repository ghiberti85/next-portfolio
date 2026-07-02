import { render, screen } from "@testing-library/react";
import GitHubActivity from "@/components/GitHubActivity";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import type { GitHubStats } from "@/lib/github";

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ThemeProvider>
      <LanguageProvider>{ui}</LanguageProvider>
    </ThemeProvider>
  );
}

const stats: GitHubStats = {
  profileUrl: "https://github.com/ghiberti85",
  publicRepos: 42,
  followers: 10,
  totalStars: 128,
  languages: [
    { name: "TypeScript", count: 20, percent: 60 },
    { name: "JavaScript", count: 10, percent: 30 },
  ],
  recentRepos: [
    {
      name: "next-portfolio",
      description: "Personal portfolio",
      url: "https://github.com/ghiberti85/next-portfolio",
      language: "TypeScript",
      stars: 5,
      pushedAt: "2026-06-30T12:00:00Z",
    },
    {
      name: "no-description-repo",
      description: null,
      url: "https://github.com/ghiberti85/no-description-repo",
      language: null,
      stars: 0,
      pushedAt: "2026-06-01T12:00:00Z",
    },
  ],
};

describe("GitHubActivity", () => {
  it("renders nothing when data is null", () => {
    const { container } = renderWithProviders(<GitHubActivity data={null} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders the section heading", () => {
    renderWithProviders(<GitHubActivity data={stats} />);
    expect(screen.getByRole("heading", { level: 2, name: /github activity/i })).toBeInTheDocument();
  });

  it("renders the three stat cards with values", () => {
    renderWithProviders(<GitHubActivity data={stats} />);
    const cards = screen.getAllByTestId("github-stat");
    expect(cards).toHaveLength(3);
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("128")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("renders language bars with percentages", () => {
    renderWithProviders(<GitHubActivity data={stats} />);
    expect(screen.getAllByTestId("github-language")).toHaveLength(2);
    expect(screen.getByRole("progressbar", { name: "TypeScript" })).toHaveAttribute("aria-valuenow", "60");
    expect(screen.getByText("30%")).toBeInTheDocument();
  });

  it("renders recent repos as external links", () => {
    renderWithProviders(<GitHubActivity data={stats} />);
    const repoLinks = screen.getAllByTestId("github-repo");
    expect(repoLinks).toHaveLength(2);
    expect(repoLinks[0]).toHaveAttribute("href", "https://github.com/ghiberti85/next-portfolio");
    expect(repoLinks[0]).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByText("Personal portfolio")).toBeInTheDocument();
  });

  it("renders the profile link", () => {
    renderWithProviders(<GitHubActivity data={stats} />);
    expect(screen.getByRole("link", { name: /view full profile/i })).toHaveAttribute(
      "href",
      "https://github.com/ghiberti85"
    );
  });
});
