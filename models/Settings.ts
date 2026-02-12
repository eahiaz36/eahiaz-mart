import mongoose, { Schema, models, model } from "mongoose";

const SettingsSchema = new Schema(
  {
    shippingInsideDhaka: { type: Number, default: 60 },
    shippingOutsideDhaka: { type: Number, default: 120 },
  },
  { timestamps: true }
);

export const Settings = models.Settings || model("Settings", SettingsSchema);
