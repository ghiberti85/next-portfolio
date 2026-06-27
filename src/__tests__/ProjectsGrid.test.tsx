import { render, screen, fireEvent } from "@testing-library/react";
import ProjectsGrid from "@/components/ProjectsGrid";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ThemeProvider>
      <LanguageProvider>{ui}</LanguageProvider>
    </ThemeProvider>
  );
}

describe("ProjectsGrid", () => {
  it("renders the Projects section heading", () => {
    renderWithProviders(<ProjectsGrid />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("renders the All filter button", () => {
    renderWithProviders(<ProjectsGrid />);
    expect(screen.getAllByRole("button").length).toBeGreaterThan(0);
  });

  it("renders exactly 6 project cards initially", () => {
    renderWithProviders(<ProjectsGrid />);
    expect(screen.getAllByTestId("project-card")).toHaveLength(6);
  });

  it("shows more project cards when show-more button is clicked", () => {
    renderWithProviders(<ProjectsGrid />);
    const showMoreBtn = screen.getByRole("button", { name: /ver mais|show more/i });
    fireEvent.click(showMoreBtn);
    expect(screen.getAllByTestId("project-card").length).toBeGreaterThan(6);
  });

  it("filters projects by tag", () => {
    renderWithProviders(<ProjectsGrid />);
    const nextjsButton = screen.getByRole("button", { name: "Next.js" });
    fireEvent.click(nextjsButton);
    const cards = screen.getAllByTestId("project-card");
    expect(cards.length).toBeGreaterThan(0);
    expect(cards.length).toBeLessThan(18);
  });

  it("opens a modal when a project card is clicked", () => {
    renderWithProviders(<ProjectsGrid />);
    const cards = screen.getAllByTestId("project-card");
    fireEvent.click(cards[0] as HTMLElement);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });

  it("closes the modal when the close button is clicked", () => {
    renderWithProviders(<ProjectsGrid />);
    fireEvent.click(screen.getAllByTestId("project-card")[0] as HTMLElement);
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes the modal on Escape key", () => {
    renderWithProviders(<ProjectsGrid />);
    fireEvent.click(screen.getAllByTestId("project-card")[0] as HTMLElement);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("project cards are keyboard activatable", () => {
    renderWithProviders(<ProjectsGrid />);
    const card = screen.getAllByTestId("project-card")[0] as HTMLElement;
    fireEvent.keyDown(card, { key: "Enter" });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
