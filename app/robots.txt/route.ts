export function GET() {
  const body = `User-agent: *
Allow: /

Sitemap: ${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml
`;
  return new Response(body, { headers: { "Content-Type": "text/plain" } });
}
