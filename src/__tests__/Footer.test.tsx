import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

function makeSkillsEl(scrollY = 400) {
  const el = document.createElement("div");
  el.id = "skills";
  Object.defineProperty(el, "offsetTop", { value: 100 });
  Object.defineProperty(el, "offsetHeight", { value: 200 });
  document.body.appendChild(el);
  Object.defineProperty(window, "scrollY", { writable: true, configurable: true, value: scrollY });
  return el;
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
    const el = makeSkillsEl();
    renderWithProviders(<Footer />);
    act(() => { fireEvent.scroll(window); });
    expect(screen.getByLabelText("Back to top")).toBeInTheDocument();
    document.body.removeChild(el);
  });

  it("calls window.scrollTo when back-to-top button is clicked", async () => {
    const el = makeSkillsEl();
    const user = userEvent.setup();
    renderWithProviders(<Footer />);
    act(() => { fireEvent.scroll(window); });
    await user.click(screen.getByLabelText("Back to top"));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    document.body.removeChild(el);
  });

  it("renders the current year in the copyright line", () => {
    renderWithProviders(<Footer />);
    expect(screen.getByText(new RegExp(String(new Date().getFullYear())))).toBeInTheDocument();
  });
});
