import { render, screen, fireEvent } from "@testing-library/react";
import Timeline from "@/components/Timeline";

describe("Timeline", () => {
  it("renders the Journey section heading", () => {
    render(<Timeline />);
    expect(screen.getByText("Journey")).toBeInTheDocument();
  });

  it("renders professional experience entries", () => {
    render(<Timeline />);
    expect(screen.getByText("+A Educação")).toBeInTheDocument();
    expect(screen.getByText("EBANX")).toBeInTheDocument();
  });

  it("renders education entries", () => {
    render(<Timeline />);
    expect(
      screen.getByText(/Universidade Estudual de Campinas/i)
    ).toBeInTheDocument();
  });

  it("opens modal with details when a timeline item is clicked", () => {
    render(<Timeline />);
    fireEvent.click(screen.getAllByText("View more")[0]);
    expect(screen.getByRole("button", { name: /✕/ })).toBeInTheDocument();
  });

  it("closes the modal when the close button is clicked", () => {
    render(<Timeline />);
    fireEvent.click(screen.getAllByText("View more")[0]);
    fireEvent.click(screen.getByRole("button", { name: /✕/ }));
    expect(screen.queryByRole("button", { name: /✕/ })).not.toBeInTheDocument();
  });
});
