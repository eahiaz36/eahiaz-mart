import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const COOKIE_NAME = process.env.COOKIE_NAME || "ea_session";
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export type JwtPayload = { sub: string; role: "customer" | "admin" };

export function signJwt(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function setAuthCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: (process.env.COOKIE_SECURE || "true") === "true",
    sameSite: "lax",
    path: "/",
  });
}

export function clearAuthCookie() {
  cookies().set(COOKIE_NAME, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export function getAuthToken() {
  return cookies().get(COOKIE_NAME)?.value || null;
}
