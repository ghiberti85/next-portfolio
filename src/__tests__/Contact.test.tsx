import { render, screen } from "@testing-library/react";
import Contact from "@/components/Contact";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <ThemeProvider>
      <LanguageProvider>{ui}</LanguageProvider>
    </ThemeProvider>
  );
}

describe("Contact", () => {
  it("renders the section heading", () => {
    renderWithProviders(<Contact />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("renders the email contact link", () => {
    renderWithProviders(<Contact />);
    const emailLink = screen.getByRole("link", { name: /email|e-mail/i });
    expect(emailLink).toHaveAttribute("href", "mailto:ghiberti85@gmail.com");
  });

  it("renders the LinkedIn link", () => {
    renderWithProviders(<Contact />);
    const linkedinLink = screen.getByRole("link", { name: /linkedin/i });
    expect(linkedinLink.getAttribute("href")).toContain("linkedin.com");
  });

  it("renders the GitHub link", () => {
    renderWithProviders(<Contact />);
    const githubLink = screen.getByRole("link", { name: /github/i });
    expect(githubLink).toHaveAttribute("href", "https://github.com/ghiberti85");
  });

  it("renders the WhatsApp link", () => {
    renderWithProviders(<Contact />);
    const waLink = screen.getByRole("link", { name: /whatsapp/i });
    expect(waLink.getAttribute("href")).toContain("wa.me");
  });
});
