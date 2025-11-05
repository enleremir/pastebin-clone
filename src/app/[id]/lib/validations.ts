import z from "zod";

export const verifyPastebinSchema = z.object({
  id: z.string(),
  pin: z
    .string("PIN is required")
    .min(6, "PIN must be minimum 6 characters")
    .max(24, "PIN must be at most 8 characters"),
});
