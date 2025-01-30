"use client";

import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Define the Skill type
interface Skill {
  name: string;
  icon: string;
  level: number;
}

const skills: Skill[] = [
  { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", level: 80 },
  { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", level: 70 },
  { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", level: 80 },
  { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg", level: 90 },
  { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg", level: 95 },
  { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", level: 60 },
  { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", level: 70 },
  { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg", level: 80 },
  { name: "Wordpress", icon: "https://static.cdnlogo.com/logos/w/65/wordpress.svg", level: 85 },
  { name: "Hubspot", icon: "https://static.cdnlogo.com/logos/h/24/hubspot.svg", level: 85 },
  { name: "Netlify", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/netlify/netlify-original.svg", level: 60 },
  { name: "Axios", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/axios/axios-plain-wordmark.svg", level: 70 },
  { name: "NPM", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg", level: 80 },
  { name: "SaaS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg", level: 70 },
  { name: "Storybook", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/storybook/storybook-original.svg", level: 70 },
  { name: "TailwindCSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg", level: 70 },
  { name: "Vercel", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg", level: 60 },
  { name: "Vite", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vite/vite-original.svg", level: 60 },
  { name: "Webpack", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-original.svg", level: 70 },
];

// Divide skills into two groups for two sliders
const midIndex = Math.ceil(skills.length / 2);
const firstSliderSkills = skills.slice(0, midIndex);
const secondSliderSkills = skills.slice(midIndex);

export default function SkillsSlider() {
  // Slider settings
  const sliderSettings = {
    autoplay: true,
    autoplaySpeed: 2000,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: false, // Disable arrows
    dots: false, // Disable dots
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <section id="skills" className="relative pt-8 pb-16 px-4">
      <h2 className="text-4xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
        Skills
      </h2>

      {/* First Slider */}
      <div className="relative mb-8">
        <Slider {...sliderSettings}>
          {firstSliderSkills.map((skill, index) => (
            <SkillCard key={index} skill={skill} />
          ))}
        </Slider>
      </div>

      {/* Second Slider */}
      <div className="relative">
        <Slider {...sliderSettings} rtl={true}>
          {secondSliderSkills.map((skill, index) => (
            <SkillCard key={index} skill={skill} />
          ))}
        </Slider>
      </div>
    </section>
  );
}

function SkillCard({ skill }: { skill: Skill }) {
  return (
    <div
      className="relative p-6 m-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:overflow-visible hover:shadow-2xl"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
      }}
    >
      <Image
        src={skill.icon}
        alt={skill.name}
        width={64}
        height={64}
        className="w-16 h-16 mb-4 mx-auto"
        priority
      />
      <h3 className="text-xl font-semibold text-gray-300 text-center">{skill.name}</h3>
      <div className="w-full bg-gray-700 rounded-full h-2.5 mt-4">
        <div
          className="bg-gradient-to-r from-teal-400 to-blue-500 h-2.5 rounded-full"
          style={{ width: `${skill.level}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-400 text-center mt-2">{skill.level}%</p>
    </div>
  );
}