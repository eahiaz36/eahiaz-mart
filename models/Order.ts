import mongoose, { Schema, models, model } from "mongoose";

const OrderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    titleSnapshot: { en: String, bn: String },
    priceSnapshot: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
    image: { url: String },
    variant: { type: Object, default: null },
  },
  { _id: false }
);

const TimelineSchema = new Schema(
  {
    status: { type: String, required: true },
    at: { type: Date, default: Date.now },
    note: { type: String, default: "" },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [OrderItemSchema],

    shippingZone: { type: String, enum: ["inside_dhaka", "outside_dhaka"], required: true },
    shippingFee: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    total: { type: Number, required: true },

    paymentMethod: { type: String, enum: ["cod"], default: "cod" },

    address: {
      name: String,
      phone: String,
      fullAddress: String,
      area: String,
      city: String,
    },

    status: { type: String, enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"], default: "Pending" },
    timeline: { type: [TimelineSchema], default: [{ status: "Pending" }] },
  },
  { timestamps: true }
);

OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });

export const Order = models.Order || model("Order", OrderSchema);
