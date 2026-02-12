import { bn } from "./dict.bn";
import { en } from "./dict.en";
import type { Locale } from "./config";

export function getDict(locale: Locale) {
  return locale === "en" ? en : bn;
}
