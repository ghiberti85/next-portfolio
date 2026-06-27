import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import IntroGate from "@/components/IntroGate";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";

jest.mock("@/components/TerminalIntro", () =>
  function MockTerminalIntro({ onDone }: { onDone: () => void }) {
    return <button onClick={onDone}>Complete intro</button>;
  }
);
jest.mock("@/components/Navbar", () => function MockNavbar() { return <div>Navbar</div>; });
jest.mock("@/components/Hero", () => function MockHero() { return <div>Hero</div>; });
jest.mock("@/components/ProjectsGrid", () => function MockProjectsGrid() { return <div>Projects</div>; });
jest.mock("@/components/Timeline", () => function MockTimeline() { return <div>Timeline</div>; });
jest.mock("@/components/Contact", () => function MockContact() { return <div>Contact</div>; });
jest.mock("@/components/Footer", () => function MockFooter() { return <div>Footer</div>; });
jest.mock("@/components/SkillsSlider", () => function MockSkillsSlider() { return <div>Skills</div>; });
jest.mock("@/components/AnimatedSection", () =>
  function MockAnimatedSection({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  }
);

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ThemeProvider>
      <LanguageProvider>{ui}</LanguageProvider>
    </ThemeProvider>
  );
}

describe("IntroGate", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("renders page content directly when intro has already been seen", async () => {
    sessionStorage.setItem("portfolio-intro-seen", "1");
    renderWithProviders(<IntroGate />);
    await waitFor(() => {
      expect(screen.getByText("Navbar")).toBeInTheDocument();
    });
  });

  it("shows terminal intro on first visit", async () => {
    renderWithProviders(<IntroGate />);
    await waitFor(() => {
      expect(screen.getByText("Complete intro")).toBeInTheDocument();
    });
  });

  it("does not show page content until intro is dismissed on first visit", async () => {
    renderWithProviders(<IntroGate />);
    await waitFor(() => {
      expect(screen.getByText("Complete intro")).toBeInTheDocument();
    });
    expect(screen.queryByText("Navbar")).not.toBeInTheDocument();
  });

  it("shows page content and marks intro seen after completion", async () => {
    renderWithProviders(<IntroGate />);
    await waitFor(() => {
      expect(screen.getByText("Complete intro")).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText("Complete intro"));
    await waitFor(() => {
      expect(screen.getByText("Navbar")).toBeInTheDocument();
    });
    expect(sessionStorage.getItem("portfolio-intro-seen")).toBe("1");
  });
});
