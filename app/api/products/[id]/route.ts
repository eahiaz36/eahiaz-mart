import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Product } from "@/models/Product";
import { productUpsertSchema } from "@/schemas/product.zod";
import { getAuthToken, verifyJwt } from "@/lib/auth";

export async function PUT(req: Request, ctx: { params: { id: string } }) {
  const token = getAuthToken();
  const payload = token ? verifyJwt(token) : null;
  if (!payload || payload.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await dbConnect();
  const body = await req.json();
  const parsed = productUpsertSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });

  const updated = await Product.findByIdAndUpdate(ctx.params.id, parsed.data, { new: true }).lean();
  return NextResponse.json({ ok: true, product: updated });
}

export async function DELETE(req: Request, ctx: { params: { id: string } }) {
  const token = getAuthToken();
  const payload = token ? verifyJwt(token) : null;
  if (!payload || payload.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await dbConnect();
  await Product.findByIdAndDelete(ctx.params.id);
  return NextResponse.json({ ok: true });
}
