import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("shows more project cards when show-more button is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProjectsGrid />);
    await user.click(screen.getByRole("button", { name: /ver mais|show more/i }));
    expect(screen.getAllByTestId("project-card").length).toBeGreaterThan(6);
  });

  it("filters projects by tag", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProjectsGrid />);
    await user.click(screen.getByRole("button", { name: "Next.js" }));
    const cards = screen.getAllByTestId("project-card");
    expect(cards.length).toBeGreaterThan(0);
    expect(cards.length).toBeLessThan(18);
  });

  it("opens a modal when a project card is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProjectsGrid />);
    await user.click(screen.getAllByTestId("project-card")[0] as HTMLElement);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });

  it("closes the modal when the close button is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProjectsGrid />);
    await user.click(screen.getAllByTestId("project-card")[0] as HTMLElement);
    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes the modal on Escape key", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProjectsGrid />);
    await user.click(screen.getAllByTestId("project-card")[0] as HTMLElement);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    // document-level listener — use fireEvent to dispatch directly to document
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
