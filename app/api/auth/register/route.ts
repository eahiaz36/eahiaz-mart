import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
import { registerSchema } from "@/schemas/auth.zod";
import { signJwt, setAuthCookie } from "@/lib/auth";

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const { name, email, password } = parsed.data;
  const exists = await User.findOne({ email }).lean();
  if (exists) return NextResponse.json({ error: "Email already used" }, { status: 409 });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, role: "customer" });

  const token = signJwt({ sub: String(user._id), role: user.role });
  setAuthCookie(token);

  return NextResponse.json({
    user: { id: String(user._id), name: user.name, email: user.email, role: user.role },
  });
}
