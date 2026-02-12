import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { locale } = await req.json();

  if (locale !== "bn" && locale !== "en") {
    return NextResponse.json(
      { error: "Invalid locale" },
      { status: 400 }
    );
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set("locale", locale, {
    path: "/",
    sameSite: "lax",
  });

  return response;
}
