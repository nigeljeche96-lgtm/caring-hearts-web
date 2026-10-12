import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { copyKeys } from "./copyKeys";

/** Translate presentation text only; names, submitted values and prices remain unchanged. */
export function useSiteCopy() {
  const { t } = useTranslation();
  return useCallback((text: string): string => {
    const normalized = text.replace(/\s+/g, " ").trim();
    const key = copyKeys[normalized];
    return key ? t(key, { defaultValue: text }) : text;
  }, [t]);
}