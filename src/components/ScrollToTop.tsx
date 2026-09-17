import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname]);

  useEffect(() => {
    // SPA route changes don't fire a page view automatically — send one.
    window.gtag?.("event", "page_view", { page_path: pathname });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
