import { jwtVerify } from "jose";

const COOKIE_NAME = process.env.COOKIE_NAME || "ea_session";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Missing JWT_SECRET");
  return new TextEncoder().encode(secret);
}

export async function verifyJwtEdge(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    // expected payload: { sub: "...", role: "admin" | "customer" }
    return payload as any;
  } catch {
    return null;
  }
}

export function getCookieName() {
  return COOKIE_NAME;
}
