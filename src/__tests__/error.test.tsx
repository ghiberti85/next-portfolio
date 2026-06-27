import { render, screen, fireEvent } from "@testing-library/react";
import ErrorPage from "@/app/error";

const makeError = (msg: string) => Object.assign(new globalThis.Error(msg), { digest: undefined });

describe("Error boundary page", () => {
  it("renders the error heading", () => {
    render(<ErrorPage error={makeError("Test error")} reset={jest.fn()} />);
    expect(screen.getByRole("heading", { name: /something went wrong/i })).toBeInTheDocument();
  });

  it("displays the error message", () => {
    render(<ErrorPage error={makeError("Oops!")} reset={jest.fn()} />);
    expect(screen.getByText("Oops!")).toBeInTheDocument();
  });

  it("calls reset when Try again button is clicked", () => {
    const reset = jest.fn();
    render(<ErrorPage error={makeError("Test")} reset={reset} />);
    fireEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(reset).toHaveBeenCalledTimes(1);
  });
});
