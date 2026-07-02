"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import t from "@/lib/translations";
import { projects } from "@/lib/projects";
import { useEscapeKey } from "@/hooks/useEscapeKey";
import { OPEN_TERMINAL_EVENT } from "@/lib/uiEvents";

interface TerminalEntry {
  cmd: string;
  output: string[];
}

export default function InteractiveTerminal() {
  const { lang, setLang } = useLanguage();
  const { toggleTheme } = useTheme();
  const tr = t[lang].shell;

  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);
  useEscapeKey(open, close);

  useEffect(() => {
    const onOpenEvent = () => setOpen(true);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "`") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener(OPEN_TERMINAL_EVENT, onOpenEvent);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener(OPEN_TERMINAL_EVENT, onOpenEvent);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries, open]);

  const runCommand = (raw: string): string[] | "clear" | "exit" => {
    const [cmd = "", ...args] = raw.trim().split(/\s+/);
    switch (cmd.toLowerCase()) {
      case "":
        return [];
      case "help":
        return [...tr.help];
      case "whoami":
        return [tr.whoami];
      case "projects":
        return [
          ...projects.slice(0, 6).map((p) => `${p.title} — ${p.tags.slice(0, 3).join(", ")}`),
          tr.projectsMore,
        ];
      case "skills":
        return [tr.skills];
      case "cv":
        window.open("/fernando-ghiberti-cv-en.pdf", "_blank", "noopener,noreferrer");
        return [tr.cvOpening];
      case "contact":
        return [...tr.contactLines];
      case "theme":
        toggleTheme();
        return [tr.themeToggled];
      case "lang": {
        const target = args[0]?.toLowerCase();
        if (target === "en" || target === "pt") {
          setLang(target);
          return [t[target].shell.langChanged];
        }
        return [tr.langUsage];
      }
      case "clear":
        return "clear";
      case "exit":
        return "exit";
      case "sudo":
        if (args.join(" ").toLowerCase() === "hire-me") return [tr.hireMe];
        return [`${tr.notFound}: ${raw.trim()}`];
      default:
        return [`${tr.notFound}: ${cmd}`];
    }
  };

  const handleSubmit = () => {
    const raw = input;
    setInput("");
    setHistoryIndex(-1);
    if (raw.trim()) setHistory((prev) => [raw.trim(), ...prev]);

    const result = runCommand(raw);
    if (result === "clear") {
      setEntries([]);
      return;
    }
    if (result === "exit") {
      setEntries((prev) => [...prev, { cmd: raw, output: [] }]);
      close();
      return;
    }
    setEntries((prev) => [...prev, { cmd: raw, output: result }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(historyIndex + 1, history.length - 1);
      if (history[next] !== undefined) {
        setHistoryIndex(next);
        setInput(history[next]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = historyIndex - 1;
      if (next < 0) {
        setHistoryIndex(-1);
        setInput("");
      } else if (history[next] !== undefined) {
        setHistoryIndex(next);
        setInput(history[next]);
      }
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed bottom-8 right-4 sm:right-8 z-[120] w-[calc(100vw-2rem)] sm:w-[520px] rounded-xl shadow-2xl overflow-hidden"
      style={{ border: "1px solid rgba(255,255,255,0.15)" }}
      role="dialog"
      aria-label={tr.openLabel}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Window chrome */}
      <div
        className="flex items-center gap-2 px-4 py-3"
        style={{ background: "#1e293b" }}
      >
        <button
          onClick={(e) => { e.stopPropagation(); close(); }}
          aria-label={tr.closeLabel}
          className="w-3 h-3 rounded-full bg-red-500 opacity-80 hover:opacity-100 transition"
        />
        <span className="w-3 h-3 rounded-full bg-yellow-400 opacity-80" />
        <span className="w-3 h-3 rounded-full bg-green-400 opacity-80" />
        <span className="ml-4 text-xs text-gray-500 font-mono">fernando@portfolio — zsh</span>
      </div>

      {/* Terminal body */}
      <div
        className="font-mono text-xs sm:text-sm p-4 space-y-1 overflow-y-auto overflow-x-hidden"
        style={{ background: "rgba(2,6,23,0.95)", height: "280px" }}
        data-testid="terminal-output"
      >
        <p className="text-gray-400">{tr.welcome}</p>
        {entries.map((entry, i) => (
          <div key={i}>
            <p>
              <span className="text-teal-400">➜ </span>
              <span className="text-gray-200">{entry.cmd}</span>
            </p>
            {entry.output.map((line, j) => (
              <p key={j} className="text-gray-400 pl-4 break-words whitespace-pre-wrap">{line}</p>
            ))}
          </div>
        ))}
        <div className="flex items-center">
          <span className="text-teal-400">➜&nbsp;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label={tr.inputLabel}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className="flex-1 bg-transparent text-gray-200 focus:outline-none font-mono"
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
