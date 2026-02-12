import { cookies } from "next/headers";

export async function readAuthToken() {
  const jar = await cookies(); // Next.js 16: cookies() is async
  return jar.get(process.env.COOKIE_NAME || "ea_session")?.value || null;
}
