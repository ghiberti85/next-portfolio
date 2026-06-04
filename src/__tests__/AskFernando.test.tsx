import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AskFernando from "@/components/AskFernando";

global.fetch = jest.fn();

describe("AskFernando", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the floating button", () => {
    render(<AskFernando />);
    expect(screen.getByRole("button", { name: /ask fernando/i })).toBeInTheDocument();
  });

  it("opens chat modal on button click", () => {
    render(<AskFernando />);
    fireEvent.click(screen.getByRole("button", { name: /ask fernando/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/hi! i'm fernando's ai assistant/i)).toBeInTheDocument();
  });

  it("closes chat modal on close button click", () => {
    render(<AskFernando />);
    fireEvent.click(screen.getByRole("button", { name: /ask fernando/i }));
    fireEvent.click(screen.getByRole("button", { name: /close chat/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes chat modal on Escape key", () => {
    render(<AskFernando />);
    fireEvent.click(screen.getByRole("button", { name: /ask fernando/i }));
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("sends a message and displays AI reply", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ reply: "Fernando is a Senior Fullstack Developer." }),
    });

    render(<AskFernando />);
    fireEvent.click(screen.getByRole("button", { name: /ask fernando/i }));

    const input = screen.getByPlaceholderText(/ask something/i);
    fireEvent.change(input, { target: { value: "Who is Fernando?" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      expect(screen.getByText("Fernando is a Senior Fullstack Developer.")).toBeInTheDocument();
    });
  });

  it("shows error message on fetch failure", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    render(<AskFernando />);
    fireEvent.click(screen.getByRole("button", { name: /ask fernando/i }));

    const input = screen.getByPlaceholderText(/ask something/i);
    fireEvent.change(input, { target: { value: "test" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });
});
