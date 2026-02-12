import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { getAuthToken, verifyJwt } from "@/lib/auth";
import { checkoutSchema } from "@/schemas/order.zod";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";
import { Settings } from "@/models/Settings";

export async function POST(req: Request) {
  const token = getAuthToken();
  const payload = token ? verifyJwt(token) : null;
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const body = await req.json();
  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });

  const settings = (await Settings.findOne().lean()) || { shippingInsideDhaka: 60, shippingOutsideDhaka: 120 };
  const shippingFee = parsed.data.shippingZone === "inside_dhaka" ? settings.shippingInsideDhaka : settings.shippingOutsideDhaka;

  // Load products & validate stock
  const ids = parsed.data.items.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: ids }, isActive: true }).lean();
  const map = new Map(products.map((p: any) => [String(p._id), p]));

  let subtotal = 0;
  const orderItems = [];

  for (const it of parsed.data.items) {
    const p: any = map.get(it.productId);
    if (!p) return NextResponse.json({ error: "Product not found", productId: it.productId }, { status: 404 });
    if (p.stock < it.qty) return NextResponse.json({ error: "Out of stock", productId: it.productId }, { status: 409 });

    const unitPrice = p.salePrice ?? p.price;
    subtotal += unitPrice * it.qty;

    orderItems.push({
      productId: p._id,
      titleSnapshot: p.title,
      priceSnapshot: unitPrice,
      qty: it.qty,
      image: { url: p.images?.[0]?.url || "" },
      variant: it.variant || null,
    });
  }

  const total = subtotal + shippingFee;

  // Deduct stock (simple approach)
  for (const it of parsed.data.items) {
    await Product.updateOne({ _id: it.productId, stock: { $gte: it.qty } }, { $inc: { stock: -it.qty } });
  }

  const order = await Order.create({
    userId: payload.sub,
    items: orderItems,
    shippingZone: parsed.data.shippingZone,
    shippingFee,
    subtotal,
    total,
    paymentMethod: "cod",
    address: parsed.data.address,
    status: "Pending",
    timeline: [{ status: "Pending", note: "Order placed" }],
  });

  return NextResponse.json({ ok: true, orderId: String(order._id) });
}

export async function GET(req: Request) {
  const token = getAuthToken();
  const payload = token ? verifyJwt(token) : null;
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const orders = await Order.find({ userId: payload.sub }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ items: orders.map((o: any) => ({ id: String(o._id), total: o.total, status: o.status, createdAt: o.createdAt })) });
}
