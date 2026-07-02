import { render, screen, act } from "@testing-library/react";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";

function ThemeDisplay() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={() => toggleTheme()}>Toggle</button>
      <button onClick={() => toggleTheme({ x: 10, y: 20 })}>Toggle with origin</button>
    </div>
  );
}

type DocumentWithViewTransition = Document & {
  startViewTransition?: (callback: () => void) => unknown;
};

describe("ThemeContext", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    delete (document as DocumentWithViewTransition).startViewTransition;
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

  it("uses startViewTransition when the browser supports it", () => {
    const startViewTransition = jest.fn((cb: () => void) => { cb(); });
    (document as DocumentWithViewTransition).startViewTransition = startViewTransition;
    render(<ThemeProvider><ThemeDisplay /></ThemeProvider>);
    act(() => { screen.getByRole("button", { name: "Toggle with origin" }).click(); });
    expect(startViewTransition).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId("theme")).toHaveTextContent("light");
    expect(document.documentElement.style.getPropertyValue("--theme-reveal-x")).toBe("10px");
    expect(document.documentElement.style.getPropertyValue("--theme-reveal-y")).toBe("20px");
  });

  it("skips the view transition when prefers-reduced-motion is set", () => {
    const startViewTransition = jest.fn((cb: () => void) => { cb(); });
    (document as DocumentWithViewTransition).startViewTransition = startViewTransition;
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })) as typeof window.matchMedia;

    render(<ThemeProvider><ThemeDisplay /></ThemeProvider>);
    act(() => { screen.getByRole("button", { name: "Toggle" }).click(); });
    expect(startViewTransition).not.toHaveBeenCalled();
    expect(screen.getByTestId("theme")).toHaveTextContent("light");

    window.matchMedia = originalMatchMedia;
  });
});
