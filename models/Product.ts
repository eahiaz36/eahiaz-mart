import mongoose, { Schema, models, model } from "mongoose";

const VariantSchema = new Schema(
  {
    name: { type: String, required: true }, // e.g. "Color" or "Size"
    options: [{ label: String, value: String }],
  },
  { _id: false }
);

const ProductSchema = new Schema(
  {
    title: {
      en: { type: String, required: true, trim: true },
      bn: { type: String, required: true, trim: true },
    },
    slug: { type: String, required: true, unique: true, trim: true },
    description: {
      en: { type: String, default: "" },
      bn: { type: String, default: "" },
    },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, default: null },
    stock: { type: Number, required: true, min: 0 },
    images: [{ url: String, publicId: String }],
    variants: [VariantSchema],
    featured: { type: Boolean, default: false },
    soldCount: { type: Number, default: 0 },
    avgRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProductSchema.index({ slug: 1 });
ProductSchema.index({ category: 1, createdAt: -1 });
ProductSchema.index({ "title.en": "text", "title.bn": "text" });

export const Product = models.Product || model("Product", ProductSchema);
