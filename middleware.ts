import { NextResponse, NextRequest } from "next/server";
import { verifyJwt } from "@/lib/auth";

const LOCALES = ["bn", "en"] as const;

function getLocale(req: NextRequest) {
  const cookieLocale = req.cookies.get("locale")?.value;
  if (cookieLocale && LOCALES.includes(cookieLocale as any)) return cookieLocale;
  return "bn";
}

export function middleware(req: NextRequest) {
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

  // Admin protection: /admin is under /admin/[locale]/...
  const isAdmin = pathname.includes("/admin/");
  if (isAdmin) {
    const token = req.cookies.get(process.env.COOKIE_NAME || "ea_session")?.value;
    const payload = token ? verifyJwt(token) : null;
    if (!payload || payload.role !== "admin") {
      const url = req.nextUrl.clone();
      // Redirect to locale login
      const locale = pathname.split("/")[2] || "bn";
      url.pathname = `/${locale}/login`;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
