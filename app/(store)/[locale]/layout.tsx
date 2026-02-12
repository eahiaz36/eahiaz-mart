import "@/app/globals.css";
import type { ReactNode } from "react";
import { getDict } from "@/lib/i18n/getDict";

export default async function StoreLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dict = getDict(locale as "bn" | "en");

  return (
    <html lang={locale}>
      <body className="bg-gray-50 text-gray-900">
        {/* Header component can stay same */}
        <main className="mx-auto max-w-7xl px-3 py-4">
          {children}
        </main>
      </body>
    </html>
  );
}
