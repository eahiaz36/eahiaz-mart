import { NextResponse, NextRequest } from "next/server";
import { verifyJwtEdge, getCookieName } from "@/lib/auth-edge";

const LOCALES = ["bn", "en"] as const;

function getLocale(req: NextRequest) {
  const cookieLocale = req.cookies.get("locale")?.value;
  if (cookieLocale === "bn" || cookieLocale === "en") return cookieLocale;
  return "bn";
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip next internals
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
    return NextResponse.next();
  }

  // Ensure locale prefix
  const hasLocale = LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (!hasLocale) {
    const locale = getLocale(req);
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(url);
  }

  // Admin protection: /{locale}/admin/...
  const isAdminRoute = /^\/(bn|en)\/admin(\/|$)/.test(pathname);
  if (isAdminRoute) {
    const token = req.cookies.get(getCookieName())?.value || null;

    if (!token) {
      const locale = pathname.split("/")[1] || "bn";
      const url = req.nextUrl.clone();
      url.pathname = `/${locale}/login`;
      return NextResponse.redirect(url);
    }

    const payload = await verifyJwtEdge(token);
    if (!payload || payload.role !== "admin") {
      const locale = pathname.split("/")[1] || "bn";
      const url = req.nextUrl.clone();
      url.pathname = `/${locale}/login`;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
