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
    expect(screen.getByText("Entre em Contato")).toBeInTheDocument();
  });

  it("renders the email contact link", () => {
    renderWithProviders(<Contact />);
    const emailLink = screen.getByText("Enviar E-mail");
    expect(emailLink).toHaveAttribute("href", "mailto:ghiberti85@gmail.com");
  });

  it("renders the LinkedIn link", () => {
    renderWithProviders(<Contact />);
    const linkedinLink = screen.getByText("Ver meu LinkedIn");
    expect(linkedinLink).toHaveAttribute("href", "https://www.linkedin.com/in/ghiberti85/");
  });

  it("renders the GitHub link", () => {
    renderWithProviders(<Contact />);
    const githubLink = screen.getByText("Ver meu GitHub");
    expect(githubLink).toHaveAttribute("href", "https://github.com/ghiberti85");
  });

  it("renders the WhatsApp link", () => {
    renderWithProviders(<Contact />);
    const waLink = screen.getByText("Mensagem no WhatsApp");
    expect(waLink.getAttribute("href")).toContain("wa.me");
  });
});
