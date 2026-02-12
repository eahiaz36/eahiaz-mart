import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Product } from "@/models/Product";
import { sanitizeSearch } from "@/lib/sanitize";

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);

  const q = sanitizeSearch(searchParams.get("q") || "");
  const category = searchParams.get("category");
  const minPrice = Number(searchParams.get("minPrice") || 0);
  const maxPrice = Number(searchParams.get("maxPrice") || 0);
  const sort = searchParams.get("sort") || "newest"; // newest, price_asc, price_desc
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const limit = Math.min(48, Math.max(12, Number(searchParams.get("limit") || 24)));
  const skip = (page - 1) * limit;

  const filter: any = { isActive: true };
  if (q) filter.$text = { $search: q };
  if (category) filter.category = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = minPrice;
    if (maxPrice) filter.price.$lte = maxPrice;
  }

  const sortObj: any =
    sort === "price_asc" ? { price: 1 } : sort === "price_desc" ? { price: -1 } : { createdAt: -1 };

  const [items, total] = await Promise.all([
    Product.find(filter).sort(sortObj).skip(skip).limit(limit).populate("category", "slug name").lean(),
    Product.countDocuments(filter),
  ]);

  return NextResponse.json({
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    items: items.map((p: any) => ({
      id: String(p._id),
      title: p.title,
      slug: p.slug,
      price: p.price,
      salePrice: p.salePrice,
      stock: p.stock,
      images: p.images,
      avgRating: p.avgRating,
      reviewCount: p.reviewCount,
      featured: p.featured,
      category: p.category,
    })),
  });
}
