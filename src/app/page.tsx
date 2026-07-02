import IntroGate from "@/components/IntroGate";
import { getGitHubStats } from "@/lib/github";

export const revalidate = 3600;

export default async function Home() {
  const github = await getGitHubStats();
  return <IntroGate github={github} />;
}
