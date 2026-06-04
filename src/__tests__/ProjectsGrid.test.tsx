import { render, screen, fireEvent } from "@testing-library/react";
import ProjectsGrid from "@/components/ProjectsGrid";

describe("ProjectsGrid", () => {
  it("renders the Projects section heading", () => {
    render(<ProjectsGrid />);
    expect(screen.getByText("Projects")).toBeInTheDocument();
  });

  it("renders the 'All Projects' filter button", () => {
    render(<ProjectsGrid />);
    expect(screen.getByText("All Projects")).toBeInTheDocument();
  });

  it("renders exactly 6 projects initially", () => {
    render(<ProjectsGrid />);
    expect(screen.getAllByText("View more")).toHaveLength(6);
  });

  it("shows more projects when 'See More' is clicked", () => {
    render(<ProjectsGrid />);
    fireEvent.click(screen.getByText("See More"));
    expect(screen.getAllByText("View more").length).toBeGreaterThan(6);
  });

  it("filters projects by tag", () => {
    render(<ProjectsGrid />);
    const nextjsButton = screen.getByRole("button", { name: "Next.js" });
    fireEvent.click(nextjsButton);
    const cards = screen.getAllByText("View more");
    expect(cards.length).toBeGreaterThan(0);
    expect(cards.length).toBeLessThan(12);
  });

  it("opens a modal when a project card is clicked", () => {
    render(<ProjectsGrid />);
    fireEvent.click(screen.getAllByText("View more")[0]);
    expect(screen.getByRole("button", { name: /✕/ })).toBeInTheDocument();
  });

  it("closes the modal when the close button is clicked", () => {
    render(<ProjectsGrid />);
    fireEvent.click(screen.getAllByText("View more")[0]);
    fireEvent.click(screen.getByRole("button", { name: /✕/ }));
    expect(screen.queryByRole("button", { name: /✕/ })).not.toBeInTheDocument();
  });
});
