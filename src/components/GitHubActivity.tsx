"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faCodeBranch, faUsers, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { useLanguage } from "@/context/LanguageContext";
import t from "@/lib/translations";
import type { GitHubStats } from "@/lib/github";
import DecryptText from "@/components/DecryptText";

interface GitHubActivityProps {
  data: GitHubStats | null;
}

export default function GitHubActivity({ data }: GitHubActivityProps) {
  const { lang } = useLanguage();
  const tr = t[lang].github;

  if (!data) return null;

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(lang === "pt" ? "pt-BR" : "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(iso));

  const statItems = [
    { icon: faCodeBranch, value: data.publicRepos, label: tr.repos },
    { icon: faStar, value: data.totalStars, label: tr.stars },
    { icon: faUsers, value: data.followers, label: tr.followers },
  ];

  return (
    <section id="github-activity" className="py-12 lg:py-20 px-4">
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
        <DecryptText text={tr.title} />
      </h2>
      <p className="text-center text-sm mb-12 sm:mb-16" style={{ color: "var(--color-text-muted)" }}>
        {tr.subtitle}
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
        {statItems.map(({ icon, value, label }) => (
          <div
            key={label}
            data-testid="github-stat"
            className="glass-card rounded-lg p-4 text-center"
          >
            <FontAwesomeIcon icon={icon} className="text-teal-400 mb-2" />
            <p className="text-2xl font-bold" style={{ color: "var(--color-heading)" }}>
              {value}
            </p>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
        {/* Top languages */}
        <div>
          <h3 className="text-lg font-semibold mb-6" style={{ color: "var(--color-heading)" }}>
            {tr.topLanguages}
          </h3>
          <ul className="space-y-4">
            {data.languages.map((language) => (
              <li key={language.name} data-testid="github-language">
                <div className="flex justify-between text-sm mb-1">
                  <span style={{ color: "var(--color-text)" }}>{language.name}</span>
                  <span style={{ color: "var(--color-text-muted)" }}>{language.percent}%</span>
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)" }}
                  role="progressbar"
                  aria-label={language.name}
                  aria-valuenow={language.percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${language.percent}%`, background: "var(--gradient-accent-r)" }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Recently updated repos */}
        <div>
          <h3 className="text-lg font-semibold mb-6" style={{ color: "var(--color-heading)" }}>
            {tr.recentRepos}
          </h3>
          <ul className="space-y-3">
            {data.recentRepos.map((repo) => (
              <li key={repo.name}>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="github-repo"
                  className="block glass-card rounded-lg p-4 transition-transform hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-sm truncate" style={{ color: "var(--color-heading)" }}>
                      {repo.name}
                    </span>
                    <span className="flex items-center gap-1 text-xs flex-shrink-0" style={{ color: "var(--color-text-muted)" }}>
                      <FontAwesomeIcon icon={faStar} className="text-teal-400" />
                      {repo.stars}
                    </span>
                  </div>
                  {repo.description && (
                    <p className="text-xs mt-1 line-clamp-2" style={{ color: "var(--color-text-muted)" }}>
                      {repo.description}
                    </p>
                  )}
                  <p className="text-xs mt-2" style={{ color: "var(--color-text-muted)" }}>
                    {repo.language ? `${repo.language} · ` : ""}
                    {tr.updated} {formatDate(repo.pushedAt)}
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="text-center mt-10">
        <a
          href={data.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold hover:scale-105 transition-transform"
          style={{ background: "var(--gradient-accent)" }}
        >
          <FontAwesomeIcon icon={faGithub} />
          {tr.viewProfile}
          <FontAwesomeIcon icon={faExternalLinkAlt} className="text-xs" />
        </a>
      </div>
    </section>
  );
}
