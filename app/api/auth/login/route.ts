import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
import { loginSchema } from "@/schemas/auth.zod";
import { signJwt, setAuthCookie } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "local";
  const rl = rateLimit(`login:${ip}`, 10, 10 * 60 * 1000);
  if (!rl.ok) return NextResponse.json({ error: "Too many attempts" }, { status: 429 });

  await dbConnect();
  const body = await req.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { email, password } = parsed.data;
  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const token = signJwt({ sub: String(user._id), role: user.role });
  setAuthCookie(token);

  return NextResponse.json({
    user: { id: String(user._id), name: user.name, email: user.email, role: user.role },
  });
}
