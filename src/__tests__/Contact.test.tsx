import { render, screen } from "@testing-library/react";
import Contact from "@/components/Contact";

describe("Contact", () => {
  it("renders the section heading", () => {
    render(<Contact />);
    expect(screen.getByText("Get in Touch")).toBeInTheDocument();
  });

  it("renders the email contact link", () => {
    render(<Contact />);
    const emailLink = screen.getByText("Send an Email");
    expect(emailLink).toHaveAttribute("href", "mailto:ghiberti85@gmail.com");
  });

  it("renders the LinkedIn link", () => {
    render(<Contact />);
    const linkedinLink = screen.getByText("Visit my LinkedIn");
    expect(linkedinLink).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/ghiberti85/"
    );
  });

  it("renders the GitHub link", () => {
    render(<Contact />);
    const githubLink = screen.getByText("Visit my GitHub");
    expect(githubLink).toHaveAttribute("href", "https://github.com/ghiberti85");
  });

  it("renders the WhatsApp link", () => {
    render(<Contact />);
    const waLink = screen.getByText("Message on WhatsApp");
    expect(waLink.getAttribute("href")).toContain("wa.me");
  });
});
