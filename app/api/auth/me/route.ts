import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
import { getAuthToken, verifyJwt } from "@/lib/auth";

export async function GET() {
  const token = getAuthToken();
  const payload = token ? verifyJwt(token) : null;
  if (!payload) return NextResponse.json({ user: null }, { status: 200 });

  await dbConnect();
  const user = await User.findById(payload.sub).select("name email role").lean();
  if (!user) return NextResponse.json({ user: null }, { status: 200 });

  return NextResponse.json({ user: { id: String(user._id), ...user } });
}
