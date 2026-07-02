"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, MotionConfig } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import t from "@/lib/translations";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { OPEN_PALETTE_EVENT, openTerminal } from "@/lib/uiEvents";

interface Command {
  id: string;
  label: string;
  keywords: string;
  run: () => void;
}

export default function CommandPalette() {
  const { lang, setLang } = useLanguage();
  const { toggleTheme } = useTheme();
  const tr = t[lang].palette;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  useEscapeKey(open, close);
  const dialogRef = useFocusTrap(open);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    const onOpenEvent = () => setOpen(true);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_PALETTE_EVENT, onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_PALETTE_EVENT, onOpenEvent);
    };
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const scrollTo = useCallback((hash: string) => {
    document.querySelector(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const commands = useMemo<Command[]>(() => {
    const c = tr.commands;
    return [
      { id: "go-home", label: c.goHome, keywords: "home hero inicio top", run: () => scrollTo("#hero") },
      { id: "go-skills", label: c.goSkills, keywords: "skills habilidades stack", run: () => scrollTo("#skills") },
      { id: "go-projects", label: c.goProjects, keywords: "projects projetos work", run: () => scrollTo("#projects") },
      { id: "go-timeline", label: c.goTimeline, keywords: "timeline carreira experience education", run: () => scrollTo("#timeline") },
      { id: "go-github", label: c.goGitHub, keywords: "github activity atividade repos", run: () => scrollTo("#github-activity") },
      { id: "go-contact", label: c.goContact, keywords: "contact contato email", run: () => scrollTo("#contact") },
      { id: "toggle-theme", label: c.toggleTheme, keywords: "theme tema dark light claro escuro", run: () => toggleTheme() },
      { id: "switch-lang", label: c.switchLang, keywords: "language idioma english portugues", run: () => setLang(lang === "en" ? "pt" : "en") },
      {
        id: "download-cv",
        label: c.downloadCV,
        keywords: "cv resume curriculo download baixar pdf",
        run: () => {
          const a = document.createElement("a");
          a.href = "/fernando-ghiberti-cv-en.pdf";
          a.download = "Fernando_Ghiberti_CV.pdf";
          a.click();
        },
      },
      { id: "open-terminal", label: c.openTerminal, keywords: "terminal shell console cli", run: () => openTerminal() },
      {
        id: "open-github",
        label: c.openGitHub,
        keywords: "github profile perfil",
        run: () => window.open("https://github.com/ghiberti85", "_blank", "noopener,noreferrer"),
      },
      {
        id: "open-linkedin",
        label: c.openLinkedIn,
        keywords: "linkedin profile perfil",
        run: () => window.open("https://linkedin.com/in/fernando-ghiberti", "_blank", "noopener,noreferrer"),
      },
      {
        id: "send-email",
        label: c.sendEmail,
        keywords: "email e-mail mail contato contact",
        run: () => { window.location.href = "mailto:ghiberti85@gmail.com"; },
      },
    ];
  }, [tr, lang, setLang, toggleTheme, scrollTo]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (cmd) => cmd.label.toLowerCase().includes(q) || cmd.keywords.includes(q)
    );
  }, [commands, query]);

  const runCommand = (cmd: Command) => {
    close();
    cmd.run();
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(filtered.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + Math.max(filtered.length, 1)) % Math.max(filtered.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const cmd = filtered[selectedIndex];
      if (cmd) runCommand(cmd);
    }
  };

  if (!open) return null;

  return (
    <MotionConfig reducedMotion="user">
      <div
        className="fixed inset-0 z-[150] flex items-start justify-center px-4 pt-[15vh] bg-black/60"
        style={{ backdropFilter: "blur(4px)" }}
        onClick={close}
        data-testid="palette-backdrop"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
          className="w-full max-w-lg rounded-xl shadow-2xl overflow-hidden"
          style={{
            backgroundColor: "var(--nav-bg)",
            backdropFilter: "blur(16px)",
            border: "1px solid var(--card-border)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={tr.placeholder}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: "var(--card-border)" }}>
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-teal-400 text-sm" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                onKeyDown={handleInputKeyDown}
                placeholder={tr.placeholder}
                aria-label={tr.placeholder}
                role="combobox"
                aria-expanded="true"
                aria-controls="palette-listbox"
                aria-activedescendant={filtered[selectedIndex] ? `palette-option-${filtered[selectedIndex].id}` : undefined}
                className="flex-1 bg-transparent focus:outline-none text-sm"
                style={{ color: "var(--color-text)" }}
              />
              <kbd
                className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded font-mono"
                style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", color: "var(--color-text-muted)" }}
              >
                Esc
              </kbd>
            </div>

            <ul id="palette-listbox" role="listbox" className="max-h-72 overflow-y-auto py-2">
              {filtered.length === 0 && (
                <li className="px-4 py-3 text-sm" style={{ color: "var(--color-text-muted)" }}>
                  {tr.noResults}
                </li>
              )}
              {filtered.map((cmd, index) => (
                <li key={cmd.id} role="presentation">
                  <button
                    id={`palette-option-${cmd.id}`}
                    role="option"
                    aria-selected={index === selectedIndex}
                    onClick={() => runCommand(cmd)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors"
                    style={{
                      background: index === selectedIndex ? "var(--card-bg)" : "transparent",
                      color: index === selectedIndex ? "var(--color-heading)" : "var(--color-text)",
                    }}
                  >
                    <span className="text-teal-400 font-mono text-xs">›</span>
                    {cmd.label}
                  </button>
                </li>
              ))}
            </ul>

            <div
              className="px-4 py-2 text-[11px] border-t"
              style={{ borderColor: "var(--card-border)", color: "var(--color-text-muted)" }}
            >
              {tr.hint}
            </div>
          </div>
        </motion.div>
      </div>
    </MotionConfig>
  );
}
