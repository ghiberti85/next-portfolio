import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorPage from "@/app/error";

const makeError = (msg: string) => Object.assign(new globalThis.Error(msg), { digest: undefined });

describe("Error boundary page", () => {
  it("renders the error heading", () => {
    render(<ErrorPage error={makeError("Test error")} reset={jest.fn()} />);
    expect(screen.getByRole("heading", { name: /something went wrong/i })).toBeInTheDocument();
  });

  it("displays a safe generic message (not raw error content)", () => {
    render(<ErrorPage error={makeError("Oops!")} reset={jest.fn()} />);
    expect(screen.getByText(/an unexpected error occurred/i)).toBeInTheDocument();
    expect(screen.queryByText("Oops!")).not.toBeInTheDocument();
  });

  it("displays the error digest when available", () => {
    const error = Object.assign(new globalThis.Error("test"), { digest: "abc-123" });
    render(<ErrorPage error={error} reset={jest.fn()} />);
    expect(screen.getByText(/error id.*abc-123/i)).toBeInTheDocument();
  });

  it("calls reset when Try again button is clicked", async () => {
    const reset = jest.fn();
    const user = userEvent.setup();
    render(<ErrorPage error={makeError("Test")} reset={reset} />);
    await user.click(screen.getByRole("button", { name: /try again/i }));
    expect(reset).toHaveBeenCalledTimes(1);
  });
});
