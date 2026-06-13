import type Lenis from "lenis";

// Module-level handle to the single Lenis instance created by <SmoothScroll>.
// Lets the detail drawer pause momentum scrolling while it is open without
// threading a context through the whole tree.
let lenis: Lenis | null = null;

export function registerLenis(instance: Lenis | null) {
  lenis = instance;
}

export function lockScroll() {
  lenis?.stop();
  if (typeof document !== "undefined") {
    document.body.style.overflow = "hidden";
  }
}

export function unlockScroll() {
  lenis?.start();
  if (typeof document !== "undefined") {
    document.body.style.overflow = "";
  }
}
