import mongoose, { Schema, models, model } from "mongoose";

const ReviewSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },

    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: "" },
    isHidden: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ReviewSchema.index({ productId: 1, createdAt: -1 });
ReviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

export const Review = models.Review || model("Review", ReviewSchema);
