import { render, screen, act } from "@testing-library/react";
import StatsCounter from "@/components/StatsCounter";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ThemeProvider>
      <LanguageProvider>{ui}</LanguageProvider>
    </ThemeProvider>
  );
}

function mockIntersectionObserver() {
  let cb: IntersectionObserverCallback = () => {};
  const observe = jest.fn();
  const disconnect = jest.fn();
  window.IntersectionObserver = jest.fn((callback) => {
    cb = callback;
    return { observe, unobserve: jest.fn(), disconnect };
  }) as unknown as typeof IntersectionObserver;
  return {
    trigger: (isIntersecting: boolean, target?: Element) =>
      act(() => {
        cb(
          [{ isIntersecting, target: target ?? document.body } as IntersectionObserverEntry],
          {} as IntersectionObserver
        );
      }),
    observe,
    disconnect,
  };
}

describe("StatsCounter", () => {
  it("renders without crashing", () => {
    const { container } = renderWithProviders(<StatsCounter />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders stat labels from translations", () => {
    renderWithProviders(<StatsCounter />);
    expect(
      screen.getByText(/years of experience|anos de experiência/i)
    ).toBeInTheDocument();
  });

  it("renders at least four stat items", () => {
    renderWithProviders(<StatsCounter />);
    expect(screen.getAllByTestId("stat-item").length).toBeGreaterThanOrEqual(4);
  });

  it("triggers count animation when stat item enters viewport", () => {
    const io = mockIntersectionObserver();
    renderWithProviders(<StatsCounter />);
    const [first] = screen.getAllByTestId("stat-item");
    io.trigger(true, first);
    expect(first).toBeInTheDocument();
  });

  it("does not activate animation when isIntersecting is false", () => {
    const io = mockIntersectionObserver();
    renderWithProviders(<StatsCounter />);
    const [first] = screen.getAllByTestId("stat-item");
    io.trigger(false, first);
    expect(first).toBeInTheDocument();
  });

  it("disconnects the observer on unmount", () => {
    const io = mockIntersectionObserver();
    const { unmount } = renderWithProviders(<StatsCounter />);
    unmount();
    expect(io.disconnect).toHaveBeenCalled();
  });
});
