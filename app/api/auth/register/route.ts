import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
import { registerSchema } from "@/schemas/auth.zod";
import { signJwt } from "@/lib/auth";

export async function POST(req: Request) {
  await dbConnect();

  const body = await req.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { name, email, password } = parsed.data;

  const exists = await User.findOne({ email });
  if (exists) {
    return NextResponse.json({ error: "Email already used" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    passwordHash,
    role: "customer",
  });

  const token = signJwt({
    sub: String(user._id),
    role: user.role,
  });

  const response = NextResponse.json({
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });

  response.cookies.set(process.env.COOKIE_NAME || "ea_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return response;
}
