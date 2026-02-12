import "@/app/globals.css";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/getDict";
import Header from "./components/Header";

export default function StoreLayout({ children, params }: { children: ReactNode; params: { locale: Locale } }) {
  const dict = getDict(params.locale);
  return (
    <html lang={params.locale}>
      <body className="bg-gray-50 text-gray-900">
        <Header locale={params.locale} dict={dict} />
        <main className="mx-auto max-w-7xl px-3 py-4">{children}</main>
      </body>
    </html>
  );
}
