import { dbConnect } from "@/lib/db";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";

export async function GET() {
  const base = process.env.NEXT_PUBLIC_SITE_URL!;
  await dbConnect();

  const [products, categories] = await Promise.all([
    Product.find({ isActive: true }).select("slug updatedAt").lean(),
    Category.find({ isActive: true }).select("slug updatedAt").lean(),
  ]);

  const urls = [
    `${base}/bn`,
    `${base}/en`,
    ...categories.flatMap((c: any) => [`${base}/bn/category/${c.slug}`, `${base}/en/category/${c.slug}`]),
    ...products.flatMap((p: any) => [`${base}/bn/product/${p.slug}`, `${base}/en/product/${p.slug}`]),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((u) => `<url><loc>${u}</loc></url>`)
  .join("\n")}
</urlset>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}
