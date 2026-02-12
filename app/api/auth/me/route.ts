import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
import { verifyJwt } from "@/lib/auth";
import { readAuthToken } from "@/lib/auth-cookies";

export async function GET() {
  const token = await readAuthToken();
  const payload = token ? verifyJwt(token) : null;
  if (!payload) return NextResponse.json({ user: null }, { status: 200 });

  await dbConnect();
  const user = await User.findById(payload.sub).select("name email role").lean();
  if (!user) return NextResponse.json({ user: null }, { status: 200 });

  return NextResponse.json({ user: { id: String((user as any)._id), ...(user as any) } });
}
