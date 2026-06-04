import { render, screen } from "@testing-library/react";
import Footer from "@/components/Footer";

describe("Footer", () => {
  it("renders the author credit", () => {
    render(<Footer />);
    expect(screen.getByText("Fernando Ghiberti")).toBeInTheDocument();
  });

  it("does not show back-to-top button on initial render (no scroll)", () => {
    render(<Footer />);
    expect(
      screen.queryByLabelText("Back to top")
    ).not.toBeInTheDocument();
  });
});
