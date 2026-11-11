import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DebugOverlay from "@/components/DebugOverlay";

function setSearch(search: string) {
  window.history.replaceState({}, "", `/${search}`);
}

describe("DebugOverlay", () => {
  beforeAll(() => {
    // jsdom has no layout engine, so elementFromPoint is not implemented.
    document.elementFromPoint = () => null;
  });

  beforeEach(() => {
    sessionStorage.clear();
    setSearch("");
  });

  it("renders nothing by default", () => {
    render(<DebugOverlay />);
    expect(screen.queryByTestId("debug-overlay")).not.toBeInTheDocument();
  });

  it("shows diagnostics when opened with ?debug=1 and remembers it for the session", () => {
    setSearch("?debug=1");
    render(<DebugOverlay />);
    expect(screen.getByTestId("debug-overlay")).toBeInTheDocument();
    expect(screen.getByText(/scrollY/)).toBeInTheDocument();
    expect(screen.getByText("no errors")).toBeInTheDocument();
    expect(sessionStorage.getItem("portfolio-debug")).toBe("1");
  });

  it("stays on after a reload without the query param", () => {
    sessionStorage.setItem("portfolio-debug", "1");
    render(<DebugOverlay />);
    expect(screen.getByTestId("debug-overlay")).toBeInTheDocument();
  });

  it("is turned off by ?debug=0", () => {
    sessionStorage.setItem("portfolio-debug", "1");
    setSearch("?debug=0");
    render(<DebugOverlay />);
    expect(screen.queryByTestId("debug-overlay")).not.toBeInTheDocument();
  });

  it("lists page sections with their opacity", () => {
    setSearch("?debug=1");
    render(
      <>
        <main>
          <section id="skills">skills</section>
        </main>
        <DebugOverlay />
      </>
    );
    expect(screen.getByText(/skills: top/)).toBeInTheDocument();
  });

  it("records uncaught errors", () => {
    setSearch("?debug=1");
    render(<DebugOverlay />);
    act(() => {
      window.dispatchEvent(new ErrorEvent("error", { message: "boom", filename: "/x/chunk.js", lineno: 7 }));
    });
    expect(screen.getByText(/ERR boom @ chunk.js:7/)).toBeInTheDocument();
  });

  it("closes when the close button is pressed", async () => {
    const user = userEvent.setup();
    setSearch("?debug=1");
    render(<DebugOverlay />);
    await user.click(screen.getByRole("button", { name: "close" }));
    expect(screen.queryByTestId("debug-overlay")).not.toBeInTheDocument();
    expect(sessionStorage.getItem("portfolio-debug")).toBeNull();
  });
});
