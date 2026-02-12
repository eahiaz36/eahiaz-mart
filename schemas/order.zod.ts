import { z } from "zod";

export const checkoutSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      qty: z.number().int().min(1),
      variant: z.any().optional(),
    })
  ).min(1),
  shippingZone: z.enum(["inside_dhaka", "outside_dhaka"]),
  address: z.object({
    name: z.string().min(2),
    phone: z.string().min(8).max(20),
    fullAddress: z.string().min(5),
    area: z.string().min(2),
    city: z.string().min(2),
  }),
});
