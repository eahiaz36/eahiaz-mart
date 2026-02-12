import { z } from "zod";

export const categoryNodeSchema = z.object({
  name: z.object({ en: z.string().min(1), bn: z.string().min(1) }),
  slug: z.string().min(1),
  children: z.array(z.any()).optional(),
});

export const categoryTreeSchema = z.array(categoryNodeSchema);
