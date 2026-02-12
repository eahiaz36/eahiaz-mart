import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import LanguageToggle from "./LanguageToggle";

export default function Header({ locale, dict }: { locale: Locale; dict: any }) {
  return (
    <header className="bg-orange-600 text-white">
      <div className="mx-auto max-w-7xl px-3 py-3 flex items-center gap-3">
        <Link href={`/${locale}`} className="font-extrabold text-xl tracking-tight">
          {dict.brand}
        </Link>

        <div className="flex-1">
          <form action={`/${locale}/search`} className="flex bg-white rounded overflow-hidden">
            <input
              name="q"
              placeholder={dict.searchPlaceholder}
              className="flex-1 px-3 py-2 text-gray-900 outline-none"
            />
            <button className="px-4 py-2 bg-orange-700 hover:bg-orange-800">Search</button>
          </form>
        </div>

        <div className="flex items-center gap-4">
          <LanguageToggle locale={locale} />
          <Link href={`/${locale}/cart`} className="hover:underline">{dict.cart}</Link>
          <Link href={`/${locale}/account`} className="hover:underline">{dict.account}</Link>
          <Link href={`/${locale}/admin/${locale}`} className="hidden md:inline hover:underline">{dict.admin}</Link>
        </div>
      </div>
    </header>
  );
}
