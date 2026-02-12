import mongoose, { Schema, models, model } from "mongoose";

const BannerSchema = new Schema(
  {
    type: { type: String, enum: ["hero", "campaign"], required: true },
    title: { en: String, bn: String },
    image: { url: String, publicId: String },
    link: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Banner = models.Banner || model("Banner", BannerSchema);
