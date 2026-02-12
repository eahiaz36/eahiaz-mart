import "@/app/globals.css";
import type { ReactNode } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";

export default function AdminLayout({ children, params }: { children: ReactNode; params: { locale: Locale } }) {
  const l = params.locale;
  return (
    <html lang={l}>
      <body className="bg-gray-50 text-gray-900">
        <div className="mx-auto max-w-7xl px-3 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link className="font-extrabold text-xl text-orange-600" href={`/${l}/admin/${l}`}>Admin • Eahiaz Mart</Link>
            <Link className="text-sm underline" href={`/${l}`}>Back to Store</Link>
          </div>

          <nav className="flex flex-wrap gap-2 mb-4">
            <Link className="px-3 py-2 bg-white rounded shadow-sm" href={`/${l}/admin/${l}`}>Dashboard</Link>
            <Link className="px-3 py-2 bg-white rounded shadow-sm" href={`/${l}/admin/${l}/categories`}>Categories</Link>
            <Link className="px-3 py-2 bg-white rounded shadow-sm" href={`/${l}/admin/${l}/products`}>Products</Link>
            <Link className="px-3 py-2 bg-white rounded shadow-sm" href={`/${l}/admin/${l}/orders`}>Orders</Link>
            <Link className="px-3 py-2 bg-white rounded shadow-sm" href={`/${l}/admin/${l}/banners`}>Banners</Link>
            <Link className="px-3 py-2 bg-white rounded shadow-sm" href={`/${l}/admin/${l}/settings`}>Settings</Link>
          </nav>

          {children}
        </div>
      </body>
    </html>
  );
}
