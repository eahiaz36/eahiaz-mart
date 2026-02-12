import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Category } from "@/models/Category";
import { categoryTreeSchema } from "@/schemas/category.zod";
import { verifyJwt } from "@/lib/auth";
import { readAuthToken } from "@/lib/auth-cookies";

type Node = {
  name: { en: string; bn: string };
  slug: string;
  children?: Node[];
};

async function upsertNode(node: Node, parentId: any, path: any[]) {
  const cat = await Category.findOneAndUpdate(
    { slug: node.slug },
    {
      name: node.name,
      slug: node.slug,
      parent: parentId,
      path,
      isActive: true,
    },
    { new: true, upsert: true }
  );

  const newPath = [...path, cat._id];
  if (node.children?.length) {
    for (const ch of node.children) {
      await upsertNode(ch, cat._id, newPath);
    }
  }
}

export async function POST(req: Request) {
  const token = await readAuthToken();
  const payload = token ? verifyJwt(token) : null;
  if (!payload || payload.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await dbConnect();
  const body = await req.json();
  const parsed = categoryTreeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid category tree", details: parsed.error.flatten() }, { status: 400 });
  }

  for (const root of parsed.data as Node[]) {
    await upsertNode(root, null, []);
  }

  return NextResponse.json({ ok: true });
}
