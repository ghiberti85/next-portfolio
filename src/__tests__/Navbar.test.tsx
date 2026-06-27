import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "@/components/Navbar";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ThemeProvider>
      <LanguageProvider>{ui}</LanguageProvider>
    </ThemeProvider>
  );
}

describe("Navbar", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the logo link", () => {
    renderWithProviders(<Navbar />);
    expect(screen.getByText("Ghiberti.dev")).toBeInTheDocument();
  });

  it("renders all navigation links on desktop", () => {
    renderWithProviders(<Navbar />);
    const links = ["Home", "Skills", "Projects", "Timeline", "Contact"];
    links.forEach((name) => {
      expect(screen.getAllByText(name).length).toBeGreaterThan(0);
    });
  });

  it("renders language toggle buttons", () => {
    renderWithProviders(<Navbar />);
    expect(screen.getAllByText("EN").length).toBeGreaterThan(0);
    expect(screen.getAllByText("PT").length).toBeGreaterThan(0);
  });

  it("renders theme toggle button", () => {
    renderWithProviders(<Navbar />);
    expect(screen.getAllByLabelText(/switch to/i).length).toBeGreaterThan(0);
  });

  it("toggles mobile menu open when hamburger is clicked", () => {
    renderWithProviders(<Navbar />);
    const toggleButton = screen.getByLabelText("Toggle menu");
    fireEvent.click(toggleButton);
    expect(screen.getAllByText("Home").length).toBeGreaterThan(1);
  });

  it("closes mobile menu when hamburger is clicked again", () => {
    renderWithProviders(<Navbar />);
    const toggle = screen.getByLabelText("Toggle menu");
    fireEvent.click(toggle);
    fireEvent.click(toggle);
    expect(screen.getAllByText("Home").length).toBe(1);
  });

  it("closes mobile menu on Escape key", () => {
    renderWithProviders(<Navbar />);
    fireEvent.click(screen.getByLabelText("Toggle menu"));
    expect(screen.getAllByText("Home").length).toBeGreaterThan(1);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.getAllByText("Home").length).toBe(1);
  });

  it("clicking the logo invokes handleScroll without crashing", () => {
    renderWithProviders(<Navbar />);
    fireEvent.click(screen.getByText("Ghiberti.dev"));
  });

  it("clicking a desktop nav link invokes handleScroll without crashing", () => {
    renderWithProviders(<Navbar />);
    fireEvent.click(screen.getAllByText("Skills")[0] as HTMLElement);
  });

  it("switches language to PT via desktop button", () => {
    renderWithProviders(<Navbar />);
    const ptBtn = screen.getAllByRole("button", { name: /mudar para português/i })[0] as HTMLElement;
    fireEvent.click(ptBtn);
    expect(ptBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("switches language to EN via desktop button", () => {
    renderWithProviders(<Navbar />);
    // switch to PT first
    fireEvent.click(screen.getAllByRole("button", { name: /mudar para português/i })[0] as HTMLElement);
    const enBtn = screen.getAllByRole("button", { name: /switch to english/i })[0] as HTMLElement;
    fireEvent.click(enBtn);
    expect(enBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("toggles theme via the theme button", () => {
    renderWithProviders(<Navbar />);
    const themeBtn = screen.getAllByLabelText(/switch to light mode/i)[0] as HTMLElement;
    fireEvent.click(themeBtn);
    expect(screen.getAllByLabelText(/switch to dark mode/i).length).toBeGreaterThan(0);
  });

  it("switches language via mobile menu buttons", () => {
    renderWithProviders(<Navbar />);
    fireEvent.click(screen.getByLabelText("Toggle menu"));
    const mobilePtBtns = screen.getAllByRole("button", { name: /mudar para português/i });
    fireEvent.click(mobilePtBtns[mobilePtBtns.length - 1] as HTMLElement);
    const mobilePtBtnsAfter = screen.getAllByRole("button", { name: /mudar para português/i });
    expect(mobilePtBtnsAfter[mobilePtBtnsAfter.length - 1]).toHaveAttribute("aria-pressed", "true");
  });

  it("clicking a mobile menu link calls handleScroll and closes the menu", () => {
    renderWithProviders(<Navbar />);
    fireEvent.click(screen.getByLabelText("Toggle menu"));
    const mobileLinks = screen.getAllByText("Skills");
    fireEvent.click(mobileLinks[mobileLinks.length - 1] as HTMLElement);
    expect(screen.getAllByText("Skills").length).toBe(1);
  });
});
