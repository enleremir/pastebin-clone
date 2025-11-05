CREATE TABLE "pastes" (
	"id" varchar(12) PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"pin_hash" varchar(255),
	"expires_at" timestamp with time zone,
	"expired" boolean DEFAULT false NOT NULL,
	"one_time" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "pastes_expires_at_idx" ON "pastes" USING btree ("expires_at");