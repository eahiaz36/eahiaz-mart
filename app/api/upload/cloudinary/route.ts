import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";
import { verifyJwt } from "@/lib/auth";
import { readAuthToken } from "@/lib/auth-cookies";

export async function POST() {
  const token = await readAuthToken();
  const payload = token ? verifyJwt(token) : null;
  if (!payload || payload.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const timestamp = Math.round(Date.now() / 1000);
  const folder = "eahiaz-mart/products";
  const signature = cloudinary.utils.api_sign_request({ timestamp, folder }, process.env.CLOUDINARY_API_SECRET!);

  return NextResponse.json({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    timestamp,
    folder,
    signature,
  });
}
