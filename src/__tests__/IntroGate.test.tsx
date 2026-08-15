import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("renders page content immediately regardless of intro state", async () => {
    renderWithProviders(<IntroGate />);
    // Content is mounted on first render (server + first paint) so it
    // counts for LCP/SEO — it is never gated behind a client-only check.
    expect(screen.getByText("Navbar")).toBeInTheDocument();
    expect(screen.getByText("Hero")).toBeInTheDocument();
  });

  it("does not show the terminal intro when it has already been seen", () => {
    sessionStorage.setItem("portfolio-intro-seen", "1");
    renderWithProviders(<IntroGate />);
    expect(screen.queryByText("Complete intro")).not.toBeInTheDocument();
  });

  it("shows terminal intro as an overlay on top of the page content on first visit", async () => {
    renderWithProviders(<IntroGate />);
    await waitFor(() => {
      expect(screen.getByText("Complete intro")).toBeInTheDocument();
    });
    // The overlay covers the content visually (fixed, opaque, high z-index)
    // but the content underneath stays mounted rather than being unmounted.
    expect(screen.getByText("Navbar")).toBeInTheDocument();
  });

  it("marks the intro as seen and dismisses the overlay on completion", async () => {
    const user = userEvent.setup();
    renderWithProviders(<IntroGate />);
    await waitFor(() => {
      expect(screen.getByText("Complete intro")).toBeInTheDocument();
    });
    await user.click(screen.getByText("Complete intro"));
    expect(sessionStorage.getItem("portfolio-intro-seen")).toBe("1");
    await waitFor(() => {
      expect(screen.queryByText("Complete intro")).not.toBeInTheDocument();
    });
  });
});
