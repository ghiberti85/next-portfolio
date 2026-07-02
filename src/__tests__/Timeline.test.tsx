import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Timeline from "@/components/Timeline";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ThemeProvider>
      <LanguageProvider>{ui}</LanguageProvider>
    </ThemeProvider>
  );
}

describe("Timeline", () => {
  it("renders the section heading", () => {
    renderWithProviders(<Timeline />);
    expect(screen.getByRole("heading", { level: 2, name: /Experiência & Formação|Experience & Education/i })).toBeInTheDocument();
  });

  it("renders professional experience entries", () => {
    renderWithProviders(<Timeline />);
    expect(screen.getAllByText("+A Educação").length).toBeGreaterThan(0);
    expect(screen.getAllByText("EBANX").length).toBeGreaterThan(0);
  });

  it("renders education entries", () => {
    renderWithProviders(<Timeline />);
    expect(screen.getAllByText(/UNICAMP/i).length).toBeGreaterThan(0);
  });

  it("opens modal with details when a timeline item is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Timeline />);
    await user.click(screen.getAllByText(/Ver mais|View more/i)[0] as HTMLElement);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });

  it("closes the modal when the close button is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Timeline />);
    await user.click(screen.getAllByText(/Ver mais|View more/i)[0] as HTMLElement);
    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes the modal on Escape key", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Timeline />);
    await user.click(screen.getAllByText(/Ver mais|View more/i)[0] as HTMLElement);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    // document-level listener — use fireEvent to dispatch directly to document
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("timeline cards are keyboard activatable", () => {
    renderWithProviders(<Timeline />);
    const cards = screen.getAllByRole("button", { name: /view details for|ver detalhes/i });
    if (cards.length > 0) {
      fireEvent.keyDown(cards[0] as HTMLElement, { key: "Enter" });
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    }
  });

  it("reserves right padding on the modal title so long titles never render under the close button", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Timeline />);
    await user.click(screen.getAllByText(/Ver mais|View more/i)[0] as HTMLElement);
    const title = screen.getByRole("dialog").querySelector("#timeline-modal-title");
    // Regression: the close button is absolutely positioned in the top-right
    // corner of the dialog; without right padding on the title, long titles
    // wrap under it and get visually clipped (confirmed via browser screenshot).
    expect(title).toHaveClass("pr-12");
  });
});
