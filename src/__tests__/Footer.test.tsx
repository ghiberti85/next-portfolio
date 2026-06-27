import { render, screen, fireEvent, act } from "@testing-library/react";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ThemeProvider>
      <LanguageProvider>{ui}</LanguageProvider>
    </ThemeProvider>
  );
}

describe("Footer", () => {
  beforeEach(() => {
    Object.defineProperty(window, "scrollY", { writable: true, configurable: true, value: 0 });
    window.scrollTo = jest.fn();
  });

  it("renders the author credit", () => {
    renderWithProviders(<Footer />);
    expect(screen.getByText("Fernando Ghiberti")).toBeInTheDocument();
  });

  it("does not show back-to-top button when scroll is at top", () => {
    renderWithProviders(<Footer />);
    expect(screen.queryByLabelText("Back to top")).not.toBeInTheDocument();
  });

  it("shows back-to-top button when scrolled past the skills section", () => {
    const skillsEl = document.createElement("div");
    skillsEl.id = "skills";
    Object.defineProperty(skillsEl, "offsetTop", { value: 100 });
    Object.defineProperty(skillsEl, "offsetHeight", { value: 200 });
    document.body.appendChild(skillsEl);

    Object.defineProperty(window, "scrollY", { writable: true, configurable: true, value: 400 });

    renderWithProviders(<Footer />);

    act(() => {
      fireEvent.scroll(window);
    });

    expect(screen.getByLabelText("Back to top")).toBeInTheDocument();
    document.body.removeChild(skillsEl);
  });

  it("calls window.scrollTo when back-to-top button is clicked", () => {
    const skillsEl = document.createElement("div");
    skillsEl.id = "skills";
    Object.defineProperty(skillsEl, "offsetTop", { value: 100 });
    Object.defineProperty(skillsEl, "offsetHeight", { value: 200 });
    document.body.appendChild(skillsEl);

    Object.defineProperty(window, "scrollY", { writable: true, configurable: true, value: 400 });

    renderWithProviders(<Footer />);

    act(() => {
      fireEvent.scroll(window);
    });

    fireEvent.click(screen.getByLabelText("Back to top"));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    document.body.removeChild(skillsEl);
  });

  it("renders the current year in the copyright line", () => {
    renderWithProviders(<Footer />);
    expect(screen.getByText(new RegExp(String(new Date().getFullYear())))).toBeInTheDocument();
  });
});
