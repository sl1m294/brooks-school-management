import { z } from "zod";

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email().trim().toLowerCase(),
    password: z.string().min(8)
  }),
  params: z.object({}),
  query: z.object({})
});

