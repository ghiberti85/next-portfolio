import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CommandPalette from "@/components/CommandPalette";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { OPEN_PALETTE_EVENT, OPEN_TERMINAL_EVENT } from "@/lib/uiEvents";

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ThemeProvider>
      <LanguageProvider>{ui}</LanguageProvider>
    </ThemeProvider>
  );
}

function openPalette() {
  act(() => {
    window.dispatchEvent(new CustomEvent(OPEN_PALETTE_EVENT));
  });
}

describe("CommandPalette", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("does not render anything while closed", () => {
    renderWithProviders(<CommandPalette />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens with Ctrl+K and closes with Ctrl+K again", () => {
    renderWithProviders(<CommandPalette />);
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens via the open-palette custom event", () => {
    renderWithProviders(<CommandPalette />);
    openPalette();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("lists all commands when the query is empty", () => {
    renderWithProviders(<CommandPalette />);
    openPalette();
    expect(screen.getAllByRole("option").length).toBe(13);
  });

  it("filters commands by query", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CommandPalette />);
    openPalette();
    await user.type(screen.getByRole("combobox"), "cv");
    const options = screen.getAllByRole("option");
    expect(options.length).toBe(1);
    expect(options[0]).toHaveTextContent(/download cv/i);
  });

  it("shows an empty state for unmatched queries", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CommandPalette />);
    openPalette();
    await user.type(screen.getByRole("combobox"), "zzzznothing");
    expect(screen.getByText(/no matching commands/i)).toBeInTheDocument();
  });

  it("navigates to a section on Enter and closes", async () => {
    const user = userEvent.setup();
    const target = document.createElement("div");
    target.id = "projects";
    document.body.appendChild(target);

    renderWithProviders(<CommandPalette />);
    openPalette();
    await user.type(screen.getByRole("combobox"), "projects");
    await user.keyboard("{Enter}");
    expect(target.scrollIntoView).toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    target.remove();
  });

  it("runs a command on click", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CommandPalette />);
    openPalette();
    await user.click(screen.getByRole("option", { name: /toggle dark \/ light theme/i }));
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("moves the selection with arrow keys", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CommandPalette />);
    openPalette();
    const options = screen.getAllByRole("option");
    expect(options[0]).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{ArrowDown}");
    expect(screen.getAllByRole("option")[1]).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{ArrowUp}");
    expect(screen.getAllByRole("option")[0]).toHaveAttribute("aria-selected", "true");
  });

  it("closes on Escape", () => {
    renderWithProviders(<CommandPalette />);
    openPalette();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes when the backdrop is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CommandPalette />);
    openPalette();
    await user.click(screen.getByTestId("palette-backdrop"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("dispatches the open-terminal event from the terminal command", async () => {
    const user = userEvent.setup();
    const listener = jest.fn();
    window.addEventListener(OPEN_TERMINAL_EVENT, listener);
    renderWithProviders(<CommandPalette />);
    openPalette();
    await user.click(screen.getByRole("option", { name: /open interactive terminal/i }));
    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener(OPEN_TERMINAL_EVENT, listener);
  });

  it("switches the language via the language command", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CommandPalette />);
    openPalette();
    await user.click(screen.getByRole("option", { name: /mudar idioma para português/i }));
    openPalette();
    expect(screen.getByRole("option", { name: /switch language to english/i })).toBeInTheDocument();
  });
});
