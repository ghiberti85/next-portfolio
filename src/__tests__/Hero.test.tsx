import { render, screen } from "@testing-library/react";
import Hero from "@/components/Hero";

jest.mock("typewriter-effect", () => {
  const Typewriter = () => <span data-testid="typewriter" />;
  Typewriter.displayName = "Typewriter";
  return Typewriter;
});

describe("Hero", () => {
  it("renders Fernando Ghiberti's name", () => {
    render(<Hero />);
    expect(screen.getByText(/Fernando Ghiberti/i)).toBeInTheDocument();
  });

  it("renders the role subtitle", () => {
    render(<Hero />);
    expect(screen.getByText(/Software Engineer/i)).toBeInTheDocument();
  });

  it("renders GitHub social link", () => {
    render(<Hero />);
    expect(screen.getByLabelText("GitHub Profile")).toBeInTheDocument();
  });

  it("renders LinkedIn social link", () => {
    render(<Hero />);
    expect(screen.getByLabelText("LinkedIn Profile")).toBeInTheDocument();
  });

  it("renders CV download button", () => {
    render(<Hero />);
    expect(screen.getByText("Download CV")).toBeInTheDocument();
  });

  it("CV download link points to the correct PDF", () => {
    render(<Hero />);
    const link = screen.getByText("Download CV").closest("a");
    expect(link).toHaveAttribute("href", "/fernando-ghiberti-cv-en.pdf");
  });
});
