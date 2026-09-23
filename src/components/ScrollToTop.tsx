import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = decodeURIComponent(hash.slice(1));
      let tries = 0;
      const tryScroll = () => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        else if (tries++ < 20) setTimeout(tryScroll, 50);
      };
      tryScroll();
      return;
    }
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname, hash]);

  useEffect(() => {
    // SPA route changes don't fire a page view automatically — send one.
    window.gtag?.("event", "page_view", { page_path: pathname });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
