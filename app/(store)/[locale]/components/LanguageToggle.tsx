"use client";

import type { Locale } from "@/lib/i18n/config";
import { usePathname, useRouter } from "next/navigation";

export default function LanguageToggle({ locale }: { locale: Locale }) {
  const router = useRouter();
  const pathname = usePathname(); // e.g. /bn/product/abc
  const rest = pathname.replace(/^\/(bn|en)/, "");

  async function setLocale(next: Locale) {
    await fetch("/api/locale", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ locale: next }) });
    router.push(`/${next}${rest || ""}`);
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <button
        className={`px-2 py-1 rounded ${locale === "bn" ? "bg-white text-orange-600 font-semibold" : "text-white/90 hover:text-white"}`}
        onClick={() => setLocale("bn")}
        type="button"
      >
        বাংলা
      </button>
      <span className="text-white/70">|</span>
      <button
        className={`px-2 py-1 rounded ${locale === "en" ? "bg-white text-orange-600 font-semibold" : "text-white/90 hover:text-white"}`}
        onClick={() => setLocale("en")}
        type="button"
      >
        English
      </button>
    </div>
  );
}
