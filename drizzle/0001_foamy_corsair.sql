ALTER TABLE "expenses" ADD COLUMN "date" date NOT NULL;--> statement-breakpoint
ALTER TABLE "expenses" ADD COLUMN "created_at" timestamp DEFAULT now();