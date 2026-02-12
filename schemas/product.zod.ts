import { z } from "zod";

export const productUpsertSchema = z.object({
  title: z.object({ en: z.string().min(2), bn: z.string().min(2) }),
  slug: z.string().min(2),
  description: z.object({ en: z.string().optional(), bn: z.string().optional() }).optional(),
  category: z.string().min(1),
  price: z.number().min(0),
  salePrice: z.number().min(0).nullable().optional(),
  stock: z.number().int().min(0),
  images: z.array(z.object({ url: z.string().url(), publicId: z.string() })).default([]),
  variants: z
    .array(
      z.object({
        name: z.string().min(1),
        options: z.array(z.object({ label: z.string().min(1), value: z.string().min(1) })).default([]),
      })
    )
    .default([]),
  featured: z.boolean().optional(),
  isActive: z.boolean().optional(),
});
