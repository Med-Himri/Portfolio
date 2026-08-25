import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Height of the fixed Navbar, so a scrolled-to section isn't hidden behind it.
const NAVBAR_OFFSET = 88;

/**
 * Scrolls to the element matching the current URL hash (e.g. "#about").
 * Needed because on a client-rendered SPA, the browser's built-in hash-scroll
 * fires before React has mounted the target element — so it silently fails
 * and leaves you at the top of the page. This retries until the element
 * actually exists.
 */
export function useScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;

    const id = location.hash.slice(1);
    let attempts = 0;
    const maxAttempts = 20; // ~1s total at 50ms intervals

    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET;
        window.scrollTo({ top, behavior: "smooth" });
        return;
      }
      attempts += 1;
      if (attempts < maxAttempts) {
        setTimeout(tryScroll, 50);
      }
    };

    tryScroll();
  }, [location.hash, location.pathname]);
}
