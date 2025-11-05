"use server";

import { db } from "@/db/drizzle";
import { pastes } from "@/db/schema";
import { hash } from "bcryptjs";
import { returnValidationErrors } from "next-safe-action";

import { getExpirationDate } from "@/lib/expiration";
import { actionClient } from "@/lib/safe-action";

import { createPastebinSchema } from "./validations";

export const createPastebin = actionClient
  .inputSchema(createPastebinSchema)
  .action(async ({ parsedInput: { content, expiration, pin } }) => {
    try {
      if (!content) {
        return returnValidationErrors(createPastebinSchema, {
          _errors: ["Content cannot be empty"],
        });
      }

      const oneTime = expiration === "once";
      const expiresAt = getExpirationDate(expiration);
      const pinHash = pin ? await hash(pin, 10) : null;

      const [paste] = await db
        .insert(pastes)
        .values({
          content,
          pinHash,
          oneTime,
          expiresAt,
        })
        .returning({
          id: pastes.id,
          expiresAt: pastes.expiresAt,
        });

      return {
        success: true,
        message: "Success! Your paste has been created.",
        data: {
          id: paste.id,
          expiresAt: paste.expiresAt,
        },
      };
    } catch (error) {
      console.error("Error creating paste:", error);
      return {
        success: false,
        message: "Failed to create paste. Please try again later.",
      };
    }
  });
