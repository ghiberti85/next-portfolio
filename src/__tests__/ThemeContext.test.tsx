import { render, screen, act } from "@testing-library/react";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";

function ThemeDisplay() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}

describe("ThemeContext", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("defaults to dark theme when localStorage is empty", () => {
    render(<ThemeProvider><ThemeDisplay /></ThemeProvider>);
    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
  });

  it("loads stored theme from localStorage on mount", async () => {
    localStorage.setItem("portfolio-theme", "light");
    render(<ThemeProvider><ThemeDisplay /></ThemeProvider>);
    await screen.findByText("light");
    expect(screen.getByTestId("theme")).toHaveTextContent("light");
  });

  it("sets data-theme attribute on documentElement on mount", async () => {
    localStorage.setItem("portfolio-theme", "light");
    render(<ThemeProvider><ThemeDisplay /></ThemeProvider>);
    await screen.findByText("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("toggles from dark to light and persists to localStorage", () => {
    render(<ThemeProvider><ThemeDisplay /></ThemeProvider>);
    act(() => { screen.getByRole("button", { name: "Toggle" }).click(); });
    expect(screen.getByTestId("theme")).toHaveTextContent("light");
    expect(localStorage.getItem("portfolio-theme")).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("toggles back to dark and persists to localStorage", () => {
    localStorage.setItem("portfolio-theme", "light");
    render(<ThemeProvider><ThemeDisplay /></ThemeProvider>);
    act(() => { screen.getByRole("button", { name: "Toggle" }).click(); });
    expect(localStorage.getItem("portfolio-theme")).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });
});
