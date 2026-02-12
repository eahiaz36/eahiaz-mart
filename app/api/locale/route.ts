import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { locale } = await req.json();
  if (locale !== "bn" && locale !== "en") {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
  }
  cookies().set("locale", locale, { path: "/", sameSite: "lax" });
  return NextResponse.json({ ok: true });
}
