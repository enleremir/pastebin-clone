import { z } from "zod";

const baseSchema = z.object({
  content: z
    .string("Content cannot be empty")
    .trim()
    .min(1, "Content cannot be empty")
    .max(10000, "Content is too long"),
  expiration: z.enum(["never", "once", "1m", "10m", "1h", "1d", "1w", "2w", "1mo", "6mo", "1y"]),
});

const pinDisabled = baseSchema.extend({
  pinEnabled: z.literal(false),
  pin: z.preprocess((v) => (v === "" ? undefined : v), z.undefined()),
});

const pinEnabled = baseSchema.extend({
  pinEnabled: z.literal(true),
  pin: z
    .string()
    .min(6, "PIN must be between 6 and 8 characters")
    .max(8, "PIN must be between 6 and 8 characters"),
});

export const createPastebinSchema = z.discriminatedUnion("pinEnabled", [pinDisabled, pinEnabled]);
