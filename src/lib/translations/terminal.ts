const terminal = {
  en: {
    lines: [
      { cmd: "whoami", out: "Fernando Ghiberti — Senior Fullstack Developer" },
      { cmd: "ls skills/", out: "React  Node.js  TypeScript  PostgreSQL  Groq-AI" },
      { cmd: "cat mission.txt", out: "Building high-quality web products that make a difference." },
      { cmd: "./launch-portfolio.sh", out: "Launching... ✓" },
    ],
    skip: "Skip intro",
  },
  pt: {
    lines: [
      { cmd: "whoami", out: "Fernando Ghiberti — Desenvolvedor Fullstack Sênior" },
      { cmd: "ls habilidades/", out: "React  Node.js  TypeScript  PostgreSQL  Groq-AI" },
      { cmd: "cat missao.txt", out: "Construindo produtos web de alta qualidade que fazem a diferença." },
      { cmd: "./iniciar-portfolio.sh", out: "Iniciando... ✓" },
    ],
    skip: "Pular intro",
  },
};

export default terminal;
