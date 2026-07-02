// Cross-component UI events for the global overlays (command palette and
// interactive terminal), so triggers (Navbar, palette) don't need shared state.

export const OPEN_PALETTE_EVENT = "portfolio:open-palette";
export const OPEN_TERMINAL_EVENT = "portfolio:open-terminal";

export function openPalette(): void {
  window.dispatchEvent(new CustomEvent(OPEN_PALETTE_EVENT));
}

export function openTerminal(): void {
  window.dispatchEvent(new CustomEvent(OPEN_TERMINAL_EVENT));
}
