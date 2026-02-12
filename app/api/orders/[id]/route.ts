import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { getAuthToken, verifyJwt } from "@/lib/auth";
import { Order } from "@/models/Order";

const allowedNext: Record<string, string[]> = {
  Pending: ["Confirmed", "Cancelled"],
  Confirmed: ["Shipped", "Cancelled"],
  Shipped: ["Delivered", "Cancelled"],
  Delivered: [],
  Cancelled: [],
};

export async function PATCH(req: Request, ctx: { params: { id: string } }) {
  const token = getAuthToken();
  const payload = token ? verifyJwt(token) : null;
  if (!payload || payload.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await dbConnect();
  const { status, note } = await req.json();

  const order: any = await Order.findById(ctx.params.id);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (!allowedNext[order.status]?.includes(status)) {
    return NextResponse.json({ error: "Invalid status transition", from: order.status, to: status }, { status: 400 });
  }

  order.status = status;
  order.timeline.push({ status, note: note || "" });
  await order.save();

  return NextResponse.json({ ok: true, status: order.status });
}

export async function GET(req: Request, ctx: { params: { id: string } }) {
  const token = getAuthToken();
  const payload = token ? verifyJwt(token) : null;
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const order = await Order.findById(ctx.params.id).lean();
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Admin can view any. Customer only own.
  if (payload.role !== "admin" && String((order as any).userId) !== payload.sub) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ order: { ...order, id: String((order as any)._id) } });
}
