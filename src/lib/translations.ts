export type Lang = "en" | "pt";

const t = {
  en: {
    nav: {
      home: "Home",
      skills: "Skills",
      projects: "Projects",
      timeline: "Timeline",
      contact: "Contact",
    },
    hero: {
      greeting: "Hi! 👋",
      role: "Software Engineer | Senior Fullstack Expert",
      description:
        "Crafting high-performance, user-friendly interfaces with a focus on delivering exceptional user experiences.",
      downloadCV: "Download CV",
      typewriterDesktop: [
        "Building modern web applications",
        "Specialist in React and Next.js",
        "Transforming ideas into reality",
      ],
      typewriterMobile: [
        "Creating web apps",
        "React & Next.js expert",
        "Bringing ideas to life",
      ],
    },
    stats: [
      { value: 10, suffix: "+", label: "Years of Experience" },
      { value: 20, suffix: "+", label: "Projects Delivered" },
      { value: 4, suffix: "", label: "AI Integrations" },
      { value: 100, suffix: "%", label: "Commitment" },
    ],
    skills: {
      title: "Skills",
      radarTitle: "Expertise Areas",
      radarData: [
        { subject: "Frontend", value: 88 },
        { subject: "Backend", value: 72 },
        { subject: "AI / APIs", value: 78 },
        { subject: "UI / Design", value: 82 },
        { subject: "CMS", value: 85 },
        { subject: "DevOps", value: 65 },
      ],
    },
    projects: {
      title: "Projects",
      all: "All Projects",
      showMore: "Show More",
      showLess: "Show Less",
      viewMore: "View more",
      viewCode: "View Code",
      liveDemo: "Live Demo",
      liveSite: "Live Site",
      close: "Close",
    },
    timeline: { title: "Experience & Education", viewMore: "View more" },
    contact: {
      title: "Get in Touch",
      collabTitle: "Let's Collaborate!",
      collabText:
        "I am always eager to collaborate on innovative projects, exchange creative ideas, and explore new opportunities. Whether you're looking to build a cutting-edge web application, enhance user experience, or scale an existing platform, I'd love to be part of your journey.",
      workTitle: "Work With Me",
      workText:
        "Whether you're a startup aiming to launch a standout product, a business seeking technical expertise, or a fellow developer passionate about learning and sharing knowledge, I am always open to meaningful conversations. Feel free to reach out — let's create something remarkable together!",
      cards: {
        email: { title: "E-mail", desc: "Reach me via email for inquiries and opportunities.", link: "Send an Email" },
        whatsapp: { title: "WhatsApp", desc: "Chat with me directly on WhatsApp.", link: "Message on WhatsApp" },
        linkedin: { title: "LinkedIn", desc: "Connect with me on LinkedIn.", link: "Visit my LinkedIn" },
        github: { title: "GitHub", desc: "Check out my projects on GitHub.", link: "Visit my GitHub" },
      },
    },
    footer: {
      developed: "Developed with",
      by: "by",
      builtWith: "Built with",
      deployedOn: "Deployed on",
    },
    terminal: {
      lines: [
        { cmd: "whoami", out: "Fernando Ghiberti — Senior Fullstack Developer" },
        { cmd: "ls skills/", out: "React  Next.js  TypeScript  Supabase  Groq-AI" },
        { cmd: "cat mission.txt", out: "Building high-quality web products that make a difference." },
        { cmd: "./launch-portfolio.sh", out: "Launching... ✓" },
      ],
      skip: "Skip intro",
    },
    askFernando: {
      greeting: "Hi! I'm Fernando's AI assistant. Ask me anything about his skills, projects, or experience.",
      placeholder: "Ask something…",
      title: "Ask Fernando AI",
      thinking: "Thinking…",
    },
  },
  pt: {
    nav: {
      home: "Início",
      skills: "Habilidades",
      projects: "Projetos",
      timeline: "Carreira",
      contact: "Contato",
    },
    hero: {
      greeting: "Olá! 👋",
      role: "Engenheiro de Software | Senior Fullstack Expert",
      description:
        "Construindo interfaces de alta performance e fáceis de usar, com foco em entregar experiências excepcionais.",
      downloadCV: "Baixar CV",
      typewriterDesktop: [
        "Construindo aplicações web modernas",
        "Especialista em React e Next.js",
        "Transformando ideias em realidade",
      ],
      typewriterMobile: [
        "Criando aplicações web",
        "Expert em React & Next.js",
        "Dando vida às suas ideias",
      ],
    },
    stats: [
      { value: 10, suffix: "+", label: "Anos de Experiência" },
      { value: 20, suffix: "+", label: "Projetos Entregues" },
      { value: 4, suffix: "", label: "Integrações com IA" },
      { value: 100, suffix: "%", label: "Comprometimento" },
    ],
    skills: {
      title: "Habilidades",
      radarTitle: "Áreas de Expertise",
      radarData: [
        { subject: "Frontend", value: 88 },
        { subject: "Backend", value: 72 },
        { subject: "IA / APIs", value: 78 },
        { subject: "UI / Design", value: 82 },
        { subject: "CMS", value: 85 },
        { subject: "DevOps", value: 65 },
      ],
    },
    projects: {
      title: "Projetos",
      all: "Todos os Projetos",
      showMore: "Ver Mais",
      showLess: "Ver Menos",
      viewMore: "Ver mais",
      viewCode: "Ver Código",
      liveDemo: "Demo ao Vivo",
      liveSite: "Site ao Vivo",
      close: "Fechar",
    },
    timeline: { title: "Experiência & Formação", viewMore: "Ver mais" },
    contact: {
      title: "Entre em Contato",
      collabTitle: "Vamos Colaborar!",
      collabText:
        "Estou sempre animado para colaborar em projetos inovadores, trocar ideias criativas e explorar novas oportunidades. Se você quer construir uma aplicação web de ponta, melhorar a experiência do usuário ou escalar uma plataforma existente, adoraria fazer parte da sua jornada.",
      workTitle: "Trabalhe Comigo",
      workText:
        "Seja você uma startup querendo lançar um produto de destaque, uma empresa buscando expertise técnica ou um desenvolvedor apaixonado por aprender e compartilhar conhecimento, estou sempre aberto a conversas significativas. Fique à vontade para entrar em contato — vamos criar algo extraordinário juntos!",
      cards: {
        email: { title: "E-mail", desc: "Entre em contato por e-mail para consultas e oportunidades.", link: "Enviar E-mail" },
        whatsapp: { title: "WhatsApp", desc: "Converse comigo diretamente pelo WhatsApp.", link: "Mensagem no WhatsApp" },
        linkedin: { title: "LinkedIn", desc: "Conecte-se comigo no LinkedIn.", link: "Ver meu LinkedIn" },
        github: { title: "GitHub", desc: "Confira meus projetos no GitHub.", link: "Ver meu GitHub" },
      },
    },
    footer: {
      developed: "Desenvolvido com",
      by: "por",
      builtWith: "Feito com",
      deployedOn: "Publicado na",
    },
    terminal: {
      lines: [
        { cmd: "whoami", out: "Fernando Ghiberti — Desenvolvedor Fullstack Sênior" },
        { cmd: "ls habilidades/", out: "React  Next.js  TypeScript  Supabase  Groq-AI" },
        { cmd: "cat missao.txt", out: "Construindo produtos web de alta qualidade que fazem a diferença." },
        { cmd: "./iniciar-portfolio.sh", out: "Iniciando... ✓" },
      ],
      skip: "Pular intro",
    },
    askFernando: {
      greeting: "Olá! Sou o assistente de IA do Fernando. Pergunte-me sobre suas habilidades, projetos ou experiência.",
      placeholder: "Pergunte algo…",
      title: "Pergunte ao Fernando",
      thinking: "Pensando…",
    },
  },
};

export default t;
