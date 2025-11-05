import { boolean, index, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 10);

export const pastes = pgTable(
  "pastes",
  {
    id: varchar("id", { length: 12 })
      .$defaultFn(() => nanoid())
      .primaryKey(),
    content: text("content").notNull(),
    pinHash: varchar("pin_hash", { length: 255 }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    oneTime: boolean("one_time").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("pastes_expires_at_idx").on(t.expiresAt)],
);

export type Paste = typeof pastes.$inferSelect;
export type NewPaste = typeof pastes.$inferInsert;
