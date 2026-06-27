import { render, screen, act } from "@testing-library/react";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";

function LangDisplay() {
  const { lang, setLang } = useLanguage();
  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <button onClick={() => setLang("pt")}>PT</button>
      <button onClick={() => setLang("en")}>EN</button>
    </div>
  );
}

describe("LanguageContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("defaults to English when localStorage is empty", () => {
    render(<LanguageProvider><LangDisplay /></LanguageProvider>);
    expect(screen.getByTestId("lang")).toHaveTextContent("en");
  });

  it("loads stored language from localStorage on mount", async () => {
    localStorage.setItem("portfolio-lang", "pt");
    render(<LanguageProvider><LangDisplay /></LanguageProvider>);
    // useEffect is async, wait for it
    await screen.findByText("pt");
    expect(screen.getByTestId("lang")).toHaveTextContent("pt");
  });

  it("ignores invalid localStorage values and defaults to English", () => {
    localStorage.setItem("portfolio-lang", "fr");
    render(<LanguageProvider><LangDisplay /></LanguageProvider>);
    expect(screen.getByTestId("lang")).toHaveTextContent("en");
  });

  it("updates language and persists to localStorage on setLang", () => {
    render(<LanguageProvider><LangDisplay /></LanguageProvider>);
    act(() => { screen.getByRole("button", { name: "PT" }).click(); });
    expect(screen.getByTestId("lang")).toHaveTextContent("pt");
    expect(localStorage.getItem("portfolio-lang")).toBe("pt");
  });

  it("switches back to English and persists to localStorage", () => {
    localStorage.setItem("portfolio-lang", "pt");
    render(<LanguageProvider><LangDisplay /></LanguageProvider>);
    act(() => { screen.getByRole("button", { name: "EN" }).click(); });
    expect(screen.getByTestId("lang")).toHaveTextContent("en");
    expect(localStorage.getItem("portfolio-lang")).toBe("en");
  });
});
