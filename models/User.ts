import mongoose, { Schema, models, model } from "mongoose";

export type UserRole = "customer" | "admin";

const AddressSchema = new Schema(
  {
    name: String,
    phone: String,
    fullAddress: String,
    area: String,
    city: String,
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    addresses: [AddressSchema],
  },
  { timestamps: true }
);

export const User = models.User || model("User", UserSchema);
