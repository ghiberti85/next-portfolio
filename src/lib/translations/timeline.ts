import type { TimelineItemData } from "./types";

const timeline = {
  en: {
    title: "Experience & Education",
    viewMore: "View more",
    items: [
      {
        title: "Senior Full-Stack Engineer & Tech Lead",
        period: "2022 – 2026",
        type: "professional" as const,
        institution: "+A Educação",
        details: [
          "Drove the CMS platform migration from HubSpot to Duda, cutting annual tooling costs by 50%+ and improving performance and marketing team autonomy across 22 websites.",
          "Architected a React + Tailwind Design System with 80+ reusable components in a Turborepo monorepo, documented in Storybook, accelerating landing page delivery by 42% across 22 marketing websites.",
          "Achieved a 38% improvement in LCP — reaching Core Web Vitals green tier — via Next.js SSR, Tailwind CSS optimization, lazy loading, and AWS S3 + CloudFront CDN delivery.",
          "Led and grew a frontend team from 3 to 5 engineers across platforms handling 10M+ annual visits, owning the technical roadmap, code reviews, 1:1s, career development, and hiring/performance decisions.",
          "Engineered high-conversion form flows with React, Formik, Yup, and Axios, increasing conversion by 27% and reducing abandonment by 25%; built dashboards integrating Google PageSpeed and LLM APIs for automated SEO and accessibility auditing.",
          "Architected a GTM-based analytics pipeline with dataLayer automation and an N8N pricing integration syncing the course database with Google Sheets, improving attribution accuracy by 35% and eliminating manual pricing errors.",
        ],
      },
      {
        title: "Specialization in Software Engineering",
        period: "2025",
        type: "education" as const,
        institution: "Universidade Estadual de Campinas – UNICAMP",
        details: [
          "Object-Oriented Analysis and Design: expertise in designing robust software architectures using OO principles.",
          "Software Validation and Verification: testing methodologies to ensure software quality and reliability.",
          "Database Modeling and Design: creating and optimizing data models for efficient storage and retrieval.",
          "Service-Oriented Architecture (SOA): implementing scalable, service-based software solutions.",
        ],
      },
      {
        title: "Software Engineer (Mid-Senior)",
        period: "2020 – 2022",
        type: "professional" as const,
        institution: "EBANX",
        details: [
          "Architected a modular React + Tailwind component system with CI/CD pipelines (Docker, GitHub Actions, AWS), cutting promotional landing page delivery time by 32%.",
          "Reduced the bug rate by 45% and increased component reusability by building a Storybook-documented React framework supporting dynamic variations for marketing campaigns.",
          "Achieved a 28% improvement in LCP and TBT (PageSpeed Insights) by adopting Next.js SSR, WebP image optimization, and lazy loading on critical pages.",
          "Improved marketing reporting accuracy by 40% by architecting dataLayer automation and real-time event tracking via Google Tag Manager.",
        ],
      },
      {
        title: "MBA in Full Stack Development",
        period: "2020",
        type: "education" as const,
        institution: "XP Educação",
        details: [
          "Full-Stack Web Development: mastered end-to-end application development, including front-end and back-end technologies.",
          "Front-End Proficiency: advanced skills in building responsive, user-friendly interfaces using modern frameworks.",
          "Back-End Expertise: server-side applications with Node.js, focusing on scalable and efficient solutions.",
          "Agile Project Management: applied Kanban methodologies for effective project organization and team collaboration.",
        ],
      },
      {
        title: "Full-Stack Developer",
        period: "2018 – Present",
        type: "professional" as const,
        institution: "Personal Projects & Freelance",
        details: [
          "Built \"DevFactory,\" an AI-orchestrated, multi-agent software factory powered by the Vercel Workflow SDK, featuring a dynamic Complexity Router and a BYOK (bring-your-own-key) model architecture for automated, cost-optimized code generation.",
          "Developed \"Ghiberti UI,\" an open-source design-system monorepo (Turborepo, pnpm, Style Dictionary v4), and an AI Code Reviewer powered by Groq for automated static code analysis.",
          "Built a suite of AI-powered career tools — DevInterviewLab (Next.js 15, Supabase, Groq) and Interview Command Center (React 19, Vite, Claude API) — plus \"Finanças do Casal\" (React, Vite, Supabase), a couples finance app with JWT-secured row-level security.",
          "Delivered freelance web applications averaging 93+ on PageSpeed Insights using Next.js, React Query, Tailwind CSS, JSON-LD structured data, and AWS S3 + CloudFront — achieving up to 28% conversion uplift.",
        ],
      },
      {
        title: "First Certificate in English",
        period: "2017",
        type: "education" as const,
        institution: "Cambridge Assessment English Exams",
        details: [
          "Advanced Reading Skills: comprehend complex texts and identify detailed information across various topics.",
          "Effective Writing Proficiency: crafting clear, coherent, and well-structured written communication.",
          "Listening and Comprehension: understanding a wide range of spoken materials, from interviews to academic discussions.",
          "Speaking Fluency: clear and confident oral communication in English, including interactive and formal conversations.",
        ],
      },
      {
        title: "Automation & Control Engineering",
        period: "2014",
        type: "education" as const,
        institution: "Instituto Mauá de Tecnologia",
        details: [
          "Robotics and Automation: designing and implementing automated systems and robotic solutions for industrial applications.",
          "Control Systems: analyzing and optimizing control processes to enhance efficiency and system performance.",
          "Electrical and Electronic Systems: designing and troubleshooting complex electrical and electronic circuits.",
          "Award-Winning Final Project: led a group project that won the ABB Award for Best Final Graduation Project.",
        ],
      },
    ] as TimelineItemData[],
  },

  pt: {
    title: "Experiência & Formação",
    viewMore: "Ver mais",
    items: [
      {
        title: "Engenheiro Full-Stack Sênior & Tech Lead",
        period: "2022 – 2026",
        type: "professional" as const,
        institution: "+A Educação",
        details: [
          "Liderei a migração da plataforma de CMS de HubSpot para Duda, reduzindo os custos anuais com ferramentas em mais de 50% e melhorando a performance e a autonomia do time de marketing em 22 sites.",
          "Arquitetei um Design System em React + Tailwind com mais de 80 componentes reutilizáveis em um monorepo Turborepo, documentado no Storybook, acelerando a entrega de landing pages em 42% em 22 sites de marketing.",
          "Alcancei uma melhora de 38% no LCP — atingindo o nível verde de Core Web Vitals — via SSR no Next.js, otimização do Tailwind CSS, lazy loading e entrega de assets estáticos via AWS S3 + CloudFront.",
          "Liderei e expandi um time de front-end de 3 para 5 engenheiros em plataformas com mais de 10 milhões de visitas anuais, sendo responsável pelo roadmap técnico, code reviews, 1:1s, desenvolvimento de carreira e participação em decisões de contratação e performance.",
          "Desenvolvi fluxos de formulário de alta conversão com React, Formik, Yup e Axios, aumentando a conversão em 27% e reduzindo o abandono em 25%; construí dashboards integrando Google PageSpeed e APIs de LLM para auditoria automatizada de SEO e acessibilidade.",
          "Arquitetei um pipeline de analytics baseado em GTM com automação de dataLayer e uma integração de precificação via N8N sincronizando o banco de cursos com Google Sheets, melhorando a precisão de atribuição em 35% e eliminando erros manuais de precificação.",
        ],
      },
      {
        title: "Especialização em Engenharia de Software",
        period: "2025",
        type: "education" as const,
        institution: "Universidade Estadual de Campinas – UNICAMP",
        details: [
          "Análise e Projeto Orientado a Objetos: expertise em arquiteturas de software robustas com princípios OO.",
          "Validação e Verificação de Software: metodologias de teste para garantir qualidade e confiabilidade.",
          "Modelagem e Design de Banco de Dados: criação e otimização de modelos de dados para armazenamento eficiente.",
          "Arquitetura Orientada a Serviços (SOA): implementação de soluções de software escaláveis baseadas em serviços.",
        ],
      },
      {
        title: "Engenheiro de Software (Pleno-Sênior)",
        period: "2020 – 2022",
        type: "professional" as const,
        institution: "EBANX",
        details: [
          "Arquitetei um sistema modular de componentes em React + Tailwind com pipelines de CI/CD (Docker, GitHub Actions, AWS), reduzindo o tempo de entrega de landing pages promocionais em 32%.",
          "Reduzi a taxa de bugs em 45% e aumentei a reutilização de componentes construindo um framework React documentado no Storybook, com suporte a variações dinâmicas para campanhas de marketing.",
          "Alcancei uma melhora de 28% no LCP e TBT (PageSpeed Insights) adotando SSR no Next.js, otimização de imagens WebP e lazy loading em páginas críticas.",
          "Melhorei a precisão dos relatórios de marketing em 40% arquitetando automação de dataLayer e rastreamento de eventos em tempo real via Google Tag Manager.",
        ],
      },
      {
        title: "MBA em Desenvolvimento Full Stack",
        period: "2020",
        type: "education" as const,
        institution: "XP Educação",
        details: [
          "Desenvolvimento Web Full-Stack: domínio de desenvolvimento end-to-end, incluindo tecnologias de front-end e back-end.",
          "Proficiência em Front-End: habilidades avançadas para construir interfaces responsivas com frameworks modernos.",
          "Expertise em Back-End: aplicações server-side com Node.js, focando em soluções escaláveis e eficientes.",
          "Gestão Ágil de Projetos: aplicação de metodologias Kanban para organização e colaboração de equipe.",
        ],
      },
      {
        title: "Desenvolvedor Full-Stack",
        period: "2018 – Presente",
        type: "professional" as const,
        institution: "Projetos Pessoais & Freelance",
        details: [
          "Construí o \"DevFactory\", uma fábrica de software multi-agente orientada por IA construída com o Vercel Workflow SDK — com um Complexity Router dinâmico e uma arquitetura de modelos BYOK (bring-your-own-key, ou \"traga sua própria chave\") para geração de código automatizada e otimizada em custo.",
          "Desenvolvi o \"Ghiberti UI\", um monorepo open-source de design system (Turborepo, pnpm, Style Dictionary v4), e um revisor de código com IA usando Groq para análise estática automatizada.",
          "Construí um conjunto de ferramentas de carreira com IA — DevInterviewLab (Next.js 15, Supabase, Groq) e Interview Command Center (React 19, Vite, Claude API) — além do \"Finanças do Casal\" (React, Vite, Supabase), um app financeiro para casais com row-level security protegida por JWT.",
          "Entreguei aplicações web freelance com média de 93+ no PageSpeed Insights usando Next.js, React Query, Tailwind CSS, dados estruturados JSON-LD e AWS S3 + CloudFront — alcançando até 28% de aumento em conversão.",
        ],
      },
      {
        title: "First Certificate in English",
        period: "2017",
        type: "education" as const,
        institution: "Cambridge Assessment English Exams",
        details: [
          "Leitura Avançada: capacidade de compreender textos complexos e identificar informações detalhadas.",
          "Escrita Eficaz: criação de comunicação escrita clara, coerente e bem estruturada para diferentes finalidades.",
          "Escuta e Compreensão: entendimento de uma ampla gama de materiais falados, de entrevistas a discussões acadêmicas.",
          "Fluência Oral: comunicação clara e confiante em inglês, incluindo conversas interativas e formais.",
        ],
      },
      {
        title: "Engenharia de Automação e Controle",
        period: "2014",
        type: "education" as const,
        institution: "Instituto Mauá de Tecnologia",
        details: [
          "Robótica e Automação: projeto e implementação de sistemas automatizados e robóticos para aplicações industriais.",
          "Sistemas de Controle: análise e otimização de processos de controle para maior eficiência e desempenho.",
          "Sistemas Elétricos e Eletrônicos: projeto e manutenção de circuitos elétricos e eletrônicos complexos.",
          "Projeto Final Premiado: liderança de projeto que ganhou o Prêmio ABB de Melhor Projeto de Conclusão de Curso.",
        ],
      },
    ] as TimelineItemData[],
  },
};

export default timeline;
