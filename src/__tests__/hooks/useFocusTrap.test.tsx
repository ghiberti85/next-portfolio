import React, { useState } from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { useFocusTrap } from "@/hooks/useFocusTrap";

function TrapFixture({ isOpen }: { isOpen: boolean }) {
  const ref = useFocusTrap(isOpen);
  return (
    <div ref={ref} data-testid="dialog">
      <button data-testid="btn-first">First</button>
      <button data-testid="btn-second">Second</button>
      <button data-testid="btn-last">Last</button>
    </div>
  );
}

function EmptyTrapFixture({ isOpen }: { isOpen: boolean }) {
  const ref = useFocusTrap(isOpen);
  return (
    <div ref={ref} data-testid="dialog">
      <span>No focusable elements here</span>
    </div>
  );
}

function ToggleTrapFixture() {
  const [open, setOpen] = useState(false);
  const ref = useFocusTrap(open);
  return (
    <div>
      <button data-testid="trigger" onClick={() => setOpen(true)}>Open</button>
      <div ref={ref} data-testid="dialog">
        <button data-testid="btn-inside">Inside</button>
      </div>
      <button data-testid="close" onClick={() => setOpen(false)}>Close</button>
    </div>
  );
}

describe("useFocusTrap", () => {
  it("focuses the first focusable element when isOpen is true", () => {
    render(<TrapFixture isOpen={true} />);
    expect(document.activeElement).toBe(screen.getByTestId("btn-first"));
  });

  it("does not auto-focus when isOpen is false", () => {
    render(<TrapFixture isOpen={false} />);
    expect(document.activeElement).not.toBe(screen.getByTestId("btn-first"));
  });

  it("ignores non-Tab keydown events inside the trap", () => {
    render(<TrapFixture isOpen={true} />);
    const dialog = screen.getByTestId("dialog");
    // Should not throw or move focus
    fireEvent.keyDown(dialog, { key: "Escape" });
    expect(screen.getByTestId("btn-first")).toBeInTheDocument();
  });

  it("wraps forward focus from last to first on Tab", () => {
    render(<TrapFixture isOpen={true} />);
    const dialog = screen.getByTestId("dialog");
    screen.getByTestId("btn-last").focus();
    fireEvent.keyDown(dialog, { key: "Tab" });
    expect(document.activeElement).toBe(screen.getByTestId("btn-first"));
  });

  it("does not wrap forward when Tab is pressed but focus is not on last element", () => {
    render(<TrapFixture isOpen={true} />);
    const dialog = screen.getByTestId("dialog");
    const second = screen.getByTestId("btn-second");
    second.focus();
    fireEvent.keyDown(dialog, { key: "Tab" });
    expect(document.activeElement).toBe(second);
  });

  it("wraps backward focus from first to last on Shift+Tab", () => {
    render(<TrapFixture isOpen={true} />);
    const dialog = screen.getByTestId("dialog");
    screen.getByTestId("btn-first").focus();
    fireEvent.keyDown(dialog, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(screen.getByTestId("btn-last"));
  });

  it("does not wrap backward when Shift+Tab is pressed but focus is not on first element", () => {
    render(<TrapFixture isOpen={true} />);
    const dialog = screen.getByTestId("dialog");
    const last = screen.getByTestId("btn-last");
    last.focus();
    fireEvent.keyDown(dialog, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(last);
  });

  it("prevents default and traps when Tab is pressed with no focusable elements", () => {
    render(<EmptyTrapFixture isOpen={true} />);
    const dialog = screen.getByTestId("dialog");
    const event = new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true });
    const spy = jest.spyOn(event, "preventDefault");
    dialog.dispatchEvent(event);
    expect(spy).toHaveBeenCalled();
  });

  it("restores focus to the previously focused element when closed", () => {
    render(<ToggleTrapFixture />);
    const trigger = screen.getByTestId("trigger");
    trigger.focus();
    expect(document.activeElement).toBe(trigger);

    act(() => { fireEvent.click(trigger); });
    expect(document.activeElement).toBe(screen.getByTestId("btn-inside"));

    act(() => { fireEvent.click(screen.getByTestId("close")); });
    expect(document.activeElement).toBe(trigger);
  });
});
