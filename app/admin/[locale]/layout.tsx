import "@/app/globals.css";
import type { ReactNode } from "react";
import Link from "next/link";

export default async function AdminLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <body className="bg-gray-50 text-gray-900">
        <div className="mx-auto max-w-7xl px-3 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link
              className="font-extrabold text-xl text-orange-600"
              href={`/${locale}/admin/${locale}`}
            >
              Admin • Eahiaz Mart
            </Link>

            <Link className="text-sm underline" href={`/${locale}`}>
              Back to Store
            </Link>
          </div>

          <nav className="flex flex-wrap gap-2 mb-4">
            <Link
              className="px-3 py-2 bg-white rounded shadow-sm"
              href={`/${locale}/admin/${locale}`}
            >
              Dashboard
            </Link>

            <Link
              className="px-3 py-2 bg-white rounded shadow-sm"
              href={`/${locale}/admin/${locale}/categories`}
            >
              Categories
            </Link>

            <Link
              className="px-3 py-2 bg-white rounded shadow-sm"
              href={`/${locale}/admin/${locale}/products`}
            >
              Products
            </Link>

            <Link
              className="px-3 py-2 bg-white rounded shadow-sm"
              href={`/${locale}/admin/${locale}/orders`}
            >
              Orders
            </Link>

            <Link
              className="px-3 py-2 bg-white rounded shadow-sm"
              href={`/${locale}/admin/${locale}/banners`}
            >
              Banners
            </Link>

            <Link
              className="px-3 py-2 bg-white rounded shadow-sm"
              href={`/${locale}/admin/${locale}/settings`}
            >
              Settings
            </Link>
          </nav>

          {children}
        </div>
      </body>
    </html>
  );
}
