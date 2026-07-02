import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InteractiveTerminal from "@/components/InteractiveTerminal";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { OPEN_TERMINAL_EVENT } from "@/lib/uiEvents";
import { projects } from "@/lib/projects";

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ThemeProvider>
      <LanguageProvider>{ui}</LanguageProvider>
    </ThemeProvider>
  );
}

function openTerminal() {
  act(() => {
    window.dispatchEvent(new CustomEvent(OPEN_TERMINAL_EVENT));
  });
}

async function typeCommand(command: string) {
  const user = userEvent.setup();
  await user.type(screen.getByRole("textbox"), `${command}{Enter}`);
}

describe("InteractiveTerminal", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("does not render anything while closed", () => {
    renderWithProviders(<InteractiveTerminal />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens via the open-terminal custom event and shows the welcome line", () => {
    renderWithProviders(<InteractiveTerminal />);
    openTerminal();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/type 'help'/i)).toBeInTheDocument();
  });

  it("toggles with Ctrl+backtick", () => {
    renderWithProviders(<InteractiveTerminal />);
    fireEvent.keyDown(window, { key: "`", ctrlKey: true });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "`", ctrlKey: true });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("lists commands on 'help'", async () => {
    renderWithProviders(<InteractiveTerminal />);
    openTerminal();
    await typeCommand("help");
    expect(screen.getByText(/whoami — about me/i)).toBeInTheDocument();
    expect(screen.getByText(/exit — close the terminal/i)).toBeInTheDocument();
  });

  it("prints identity on 'whoami'", async () => {
    renderWithProviders(<InteractiveTerminal />);
    openTerminal();
    await typeCommand("whoami");
    expect(screen.getByText(/Fernando Ghiberti — Senior Fullstack Developer/)).toBeInTheDocument();
  });

  it("lists highlighted projects on 'projects'", async () => {
    renderWithProviders(<InteractiveTerminal />);
    openTerminal();
    await typeCommand("projects");
    const firstProject = projects[0] as { title: string };
    expect(screen.getByText(new RegExp(firstProject.title))).toBeInTheDocument();
  });

  it("shows an error for unknown commands", async () => {
    renderWithProviders(<InteractiveTerminal />);
    openTerminal();
    await typeCommand("fly-to-the-moon");
    expect(screen.getByText(/command not found: fly-to-the-moon/i)).toBeInTheDocument();
  });

  it("toggles the theme on 'theme'", async () => {
    renderWithProviders(<InteractiveTerminal />);
    openTerminal();
    await typeCommand("theme");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(screen.getByText(/theme toggled/i)).toBeInTheDocument();
  });

  it("switches language with 'lang pt' and rejects bad usage", async () => {
    renderWithProviders(<InteractiveTerminal />);
    openTerminal();
    await typeCommand("lang xx");
    expect(screen.getByText(/usage: lang en\|pt/i)).toBeInTheDocument();
    await typeCommand("lang pt");
    expect(screen.getByText(/idioma alterado para português/i)).toBeInTheDocument();
  });

  it("clears the screen on 'clear'", async () => {
    renderWithProviders(<InteractiveTerminal />);
    openTerminal();
    await typeCommand("whoami");
    await typeCommand("clear");
    expect(screen.queryByText(/Fernando Ghiberti — Senior Fullstack Developer/)).not.toBeInTheDocument();
  });

  it("closes on 'exit'", async () => {
    renderWithProviders(<InteractiveTerminal />);
    openTerminal();
    await typeCommand("exit");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes on Escape", () => {
    renderWithProviders(<InteractiveTerminal />);
    openTerminal();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("recalls the previous command with ArrowUp", async () => {
    renderWithProviders(<InteractiveTerminal />);
    openTerminal();
    await typeCommand("whoami");
    const input = screen.getByRole("textbox");
    fireEvent.keyDown(input, { key: "ArrowUp" });
    expect(input).toHaveValue("whoami");
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input).toHaveValue("");
  });

  it("responds to the 'sudo hire-me' easter egg", async () => {
    renderWithProviders(<InteractiveTerminal />);
    openTerminal();
    await typeCommand("sudo hire-me");
    expect(screen.getByText(/permission granted/i)).toBeInTheDocument();
  });

  it("opens the CV on 'cv'", async () => {
    const openSpy = jest.spyOn(window, "open").mockImplementation(() => null);
    renderWithProviders(<InteractiveTerminal />);
    openTerminal();
    await typeCommand("cv");
    expect(openSpy).toHaveBeenCalledWith("/fernando-ghiberti-cv-en.pdf", "_blank", "noopener,noreferrer");
    expect(screen.getByText(/opening cv/i)).toBeInTheDocument();
    openSpy.mockRestore();
  });

  it("closes via the red traffic-light button", async () => {
    const user = userEvent.setup();
    renderWithProviders(<InteractiveTerminal />);
    openTerminal();
    await user.click(screen.getByRole("button", { name: /close terminal/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
