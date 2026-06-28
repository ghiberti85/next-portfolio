import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    ["Home", "Skills", "Projects", "Timeline", "Contact"].forEach((name) => {
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

  it("toggles mobile menu open when hamburger is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Navbar />);
    await user.click(screen.getByLabelText("Toggle menu"));
    expect(screen.getAllByText("Home").length).toBeGreaterThan(1);
  });

  it("closes mobile menu when hamburger is clicked again", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Navbar />);
    const toggle = screen.getByLabelText("Toggle menu");
    await user.click(toggle);
    await user.click(toggle);
    expect(screen.getAllByText("Home").length).toBe(1);
  });

  it("closes mobile menu on Escape key", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Navbar />);
    await user.click(screen.getByLabelText("Toggle menu"));
    expect(screen.getAllByText("Home").length).toBeGreaterThan(1);
    // document-level listener tested via fireEvent — userEvent.keyboard targets the focused element
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.getAllByText("Home").length).toBe(1);
  });

  it("clicking the logo invokes handleScroll without crashing", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Navbar />);
    await user.click(screen.getByText("Ghiberti.dev"));
  });

  it("clicking a desktop nav link invokes handleScroll without crashing", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Navbar />);
    await user.click(screen.getAllByText("Skills")[0] as HTMLElement);
  });

  it("switches language to PT via desktop button", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Navbar />);
    const ptBtn = screen.getAllByRole("button", { name: /mudar para português/i })[0] as HTMLElement;
    await user.click(ptBtn);
    expect(ptBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("switches language to EN via desktop button", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Navbar />);
    await user.click(screen.getAllByRole("button", { name: /mudar para português/i })[0] as HTMLElement);
    const enBtn = screen.getAllByRole("button", { name: /switch to english/i })[0] as HTMLElement;
    await user.click(enBtn);
    expect(enBtn).toHaveAttribute("aria-pressed", "true");
  });

  it("toggles theme via the theme button", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Navbar />);
    await user.click(screen.getAllByLabelText(/switch to light mode/i)[0] as HTMLElement);
    expect(screen.getAllByLabelText(/switch to dark mode/i).length).toBeGreaterThan(0);
  });

  it("switches language via mobile menu buttons", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Navbar />);
    await user.click(screen.getByLabelText("Toggle menu"));
    const mobilePtBtns = screen.getAllByRole("button", { name: /mudar para português/i });
    await user.click(mobilePtBtns[mobilePtBtns.length - 1] as HTMLElement);
    const mobilePtBtnsAfter = screen.getAllByRole("button", { name: /mudar para português/i });
    expect(mobilePtBtnsAfter[mobilePtBtnsAfter.length - 1]).toHaveAttribute("aria-pressed", "true");
  });

  it("clicking a mobile menu link calls handleScroll and closes the menu", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Navbar />);
    await user.click(screen.getByLabelText("Toggle menu"));
    const mobileLinks = screen.getAllByText("Skills");
    await user.click(mobileLinks[mobileLinks.length - 1] as HTMLElement);
    expect(screen.getAllByText("Skills").length).toBe(1);
  });
});
