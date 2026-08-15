import { render, waitFor } from "@testing-library/react";
import PointerOnlyEffects from "@/components/PointerOnlyEffects";

describe("PointerOnlyEffects", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders nothing on touch/coarse-pointer devices (default jsdom matchMedia)", async () => {
    const { container } = render(<PointerOnlyEffects />);
    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });

  it("mounts the pointer-only decorations when a fine pointer is detected", async () => {
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    const { container } = render(<PointerOnlyEffects />);
    await waitFor(() => {
      expect(container.firstChild).not.toBeNull();
    });
  });

  it("does not throw when mounted and unmounted", () => {
    const { unmount } = render(<PointerOnlyEffects />);
    expect(() => unmount()).not.toThrow();
  });
});
