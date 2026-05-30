import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "@/components/Navbar";

describe("Navbar", () => {
  it("renders the Portfolio logo link", () => {
    render(<Navbar />);
    expect(screen.getByText("Portfolio")).toBeInTheDocument();
  });

  it("renders all navigation links on desktop", () => {
    render(<Navbar />);
    const links = ["Home", "Skills", "Projects", "Timeline", "Contact"];
    links.forEach((name) => {
      expect(screen.getAllByText(name).length).toBeGreaterThan(0);
    });
  });

  it("toggles mobile menu when hamburger button is clicked", () => {
    render(<Navbar />);
    const toggleButton = screen.getByLabelText("Toggle menu");
    fireEvent.click(toggleButton);
    expect(screen.getAllByText("Home").length).toBeGreaterThan(1);
    fireEvent.click(toggleButton);
  });
});
