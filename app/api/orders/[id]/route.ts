import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { verifyJwt } from "@/lib/auth";
import { readAuthToken } from "@/lib/auth-cookies";
import { Order } from "@/models/Order";

const allowedNext: Record<string, string[]> = {
  Pending: ["Confirmed", "Cancelled"],
  Confirmed: ["Shipped", "Cancelled"],
  Shipped: ["Delivered", "Cancelled"],
  Delivered: [],
  Cancelled: [],
};

export async function PATCH(
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
  const { status, note } = await req.json();

  const order: any = await Order.findById(id);
  if (!order)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (!allowedNext[order.status]?.includes(status)) {
    return NextResponse.json(
      { error: "Invalid status transition" },
      { status: 400 }
    );
  }

  order.status = status;
  order.timeline.push({ status, note: note || "" });
  await order.save();

  return NextResponse.json({ ok: true, status: order.status });
}

export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;

  const token = await readAuthToken();
  const payload = token ? verifyJwt(token) : null;
  if (!payload)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const order: any = await Order.findById(id).lean();
  if (!order)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (
    payload.role !== "admin" &&
    String(order.userId) !== payload.sub
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({
    order: { ...order, id: String(order._id) },
  });
}
