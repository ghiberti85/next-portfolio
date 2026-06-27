import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AskFernando from "@/components/AskFernando";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";

global.fetch = jest.fn();

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ThemeProvider>
      <LanguageProvider>{ui}</LanguageProvider>
    </ThemeProvider>
  );
}

describe("AskFernando", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the floating button", () => {
    renderWithProviders(<AskFernando />);
    expect(screen.getByRole("button", { name: /ask fernando/i })).toBeInTheDocument();
  });

  it("opens chat modal on button click", () => {
    renderWithProviders(<AskFernando />);
    fireEvent.click(screen.getByRole("button", { name: /ask fernando/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/assistente de ia do fernando|fernando's ai assistant/i)).toBeInTheDocument();
  });

  it("closes chat modal on close button click", () => {
    renderWithProviders(<AskFernando />);
    fireEvent.click(screen.getByRole("button", { name: /ask fernando/i }));
    fireEvent.click(screen.getByRole("button", { name: /close chat/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes chat modal on Escape key", () => {
    renderWithProviders(<AskFernando />);
    fireEvent.click(screen.getByRole("button", { name: /ask fernando/i }));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("sends a message and displays AI reply", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ reply: "Fernando is a Senior Fullstack Developer." }),
    });

    renderWithProviders(<AskFernando />);
    fireEvent.click(screen.getByRole("button", { name: /ask fernando/i }));

    const input = screen.getByPlaceholderText(/ask something|pergunte algo/i);
    fireEvent.change(input, { target: { value: "Who is Fernando?" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      expect(screen.getByText("Fernando is a Senior Fullstack Developer.")).toBeInTheDocument();
    });
  });

  it("shows error message on fetch failure", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    renderWithProviders(<AskFernando />);
    fireEvent.click(screen.getByRole("button", { name: /ask fernando/i }));

    const input = screen.getByPlaceholderText(/ask something|pergunte algo/i);
    fireEvent.change(input, { target: { value: "test" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  it("shows rate limit error message on 429 response", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 429 });

    renderWithProviders(<AskFernando />);
    fireEvent.click(screen.getByRole("button", { name: /ask fernando/i }));

    const input = screen.getByPlaceholderText(/ask something|pergunte algo/i);
    fireEvent.change(input, { target: { value: "test" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      expect(screen.getByText(/too many messages/i)).toBeInTheDocument();
    });
  });

  it("shows server error message on 500 response", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false, status: 500 });

    renderWithProviders(<AskFernando />);
    fireEvent.click(screen.getByRole("button", { name: /ask fernando/i }));

    const input = screen.getByPlaceholderText(/ask something|pergunte algo/i);
    fireEvent.change(input, { target: { value: "test" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      expect(screen.getByText(/temporarily unavailable/i)).toBeInTheDocument();
    });
  });

  it("dialog has aria-modal attribute", () => {
    renderWithProviders(<AskFernando />);
    fireEvent.click(screen.getByRole("button", { name: /ask fernando/i }));
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
  });
});
