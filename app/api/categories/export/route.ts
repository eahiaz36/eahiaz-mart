import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Category } from "@/models/Category";

export async function GET() {
  await dbConnect();
  const cats = await Category.find().lean();

  // build tree
  const map = new Map<string, any>();
  cats.forEach((c: any) => map.set(String(c._id), { ...c, id: String(c._id), children: [] }));
  const roots: any[] = [];

  map.forEach((c) => {
    if (c.parent) map.get(String(c.parent))?.children.push(c);
    else roots.push(c);
  });

  return NextResponse.json(roots);
}
