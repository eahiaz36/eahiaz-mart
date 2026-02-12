import mongoose, { Schema, models, model } from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      en: { type: String, required: true, trim: true },
      bn: { type: String, required: true, trim: true },
    },
    slug: { type: String, required: true, unique: true, trim: true },
    parent: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    path: [{ type: Schema.Types.ObjectId, ref: "Category" }], // ancestors
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

CategorySchema.index({ parent: 1, sortOrder: 1 });

export const Category = models.Category || model("Category", CategorySchema);
