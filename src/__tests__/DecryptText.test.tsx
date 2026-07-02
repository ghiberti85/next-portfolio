import { render, screen, act } from "@testing-library/react";
import DecryptText from "@/components/DecryptText";

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

describe("DecryptText", () => {
  it("renders the text immediately (screen-reader copy always intact)", () => {
    render(<DecryptText text="Projects" />);
    expect(screen.getAllByText("Projects").length).toBeGreaterThanOrEqual(1);
  });

  it("observes the element for viewport entry", () => {
    const io = mockIntersectionObserver();
    render(<DecryptText text="Projects" />);
    expect(io.observe).toHaveBeenCalled();
  });

  it("scrambles and resolves back to the original text when it enters the viewport", () => {
    jest.useFakeTimers();
    const io = mockIntersectionObserver();
    const { container } = render(<DecryptText text="Projects" />);
    io.trigger(true);

    const animated = container.querySelector('[aria-hidden="true"]') as HTMLElement;
    for (let i = 0; i < 30; i++) {
      act(() => { jest.advanceTimersByTime(35); });
    }
    expect(animated.textContent).toBe("Projects");
    jest.useRealTimers();
  });

  it("does not animate when the element is not intersecting", () => {
    jest.useFakeTimers();
    const io = mockIntersectionObserver();
    const { container } = render(<DecryptText text="Projects" />);
    io.trigger(false);
    act(() => { jest.advanceTimersByTime(200); });
    const animated = container.querySelector('[aria-hidden="true"]') as HTMLElement;
    expect(animated.textContent).toBe("Projects");
    jest.useRealTimers();
  });

  it("renders static text for prefers-reduced-motion users", () => {
    const io = mockIntersectionObserver();
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

    render(<DecryptText text="Projects" />);
    expect(io.observe).not.toHaveBeenCalled();
    expect(screen.getAllByText("Projects").length).toBeGreaterThanOrEqual(1);

    window.matchMedia = originalMatchMedia;
  });

  it("disconnects the observer on unmount", () => {
    const io = mockIntersectionObserver();
    const { unmount } = render(<DecryptText text="Projects" />);
    unmount();
    expect(io.disconnect).toHaveBeenCalled();
  });
});
