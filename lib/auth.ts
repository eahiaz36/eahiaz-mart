import jwt, { SignOptions } from "jsonwebtoken";
import { cookies } from "next/headers";

const COOKIE_NAME = process.env.COOKIE_NAME || "ea_session";
const JWT_SECRET = process.env.JWT_SECRET as string;

// 👇 Explicitly type expiresIn correctly
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"];

export type JwtPayload = {
  sub: string;
  role: "customer" | "admin";
};

export function signJwt(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

export function verifyJwt(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function setAuthCookie(token: string) {
  const response = cookies();
  response.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export function clearAuthCookie() {
  const response = cookies();
  response.set(COOKIE_NAME, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
}

export function getAuthToken() {
  return cookies().get(COOKIE_NAME)?.value || null;
}
