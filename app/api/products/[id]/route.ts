import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Product } from "@/models/Product";
import { productUpsertSchema } from "@/schemas/product.zod";
import { verifyJwt } from "@/lib/auth";
import { readAuthToken } from "@/lib/auth-cookies";

export async function PUT(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;

  const token = await readAuthToken();
  const payload = token ? verifyJwt(token) : null;

  if (!payload || payload.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await dbConnect();
  const body = await req.json();
  const parsed = productUpsertSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const updated = await Product.findByIdAndUpdate(id, parsed.data, {
    new: true,
  }).lean();

  return NextResponse.json({
    ok: true,
    product: updated,
  });
}

export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;

  const token = await readAuthToken();
  const payload = token ? verifyJwt(token) : null;

  if (!payload || payload.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await dbConnect();
  await Product.findByIdAndDelete(id);

  return NextResponse.json({ ok: true });
}
