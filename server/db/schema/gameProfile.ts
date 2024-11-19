import {
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

export const regionEnum = pgEnum("region", [
  "America",
  "Europe",
  "Asia",
  "TW, HK, MO",
])
export const gameEnum = pgEnum("game", [
  "Genshin Impact",
  "Honkai Star Rail",
  "Zenless Zone Zero",
])

export const gameProfile = pgTable(
  "game_profile",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    game: gameEnum().notNull(),
    ign: text("ign").notNull(),
    gameUID: text("game_uid").notNull(),
    region: regionEnum().notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (game_profile) => [index("user_gameProfile_idx").on(game_profile.userId)]
)

// export const insertExpensesSchema = createInsertSchema(expenses, {
//   title: z.string().min(3, { message: "Title must be at least 3 characters" }),
//   amount: z.string().regex(/^\d+(\.\d{1,2})?$/, {
//     message: "Amount must be a valid monetary value",
//   }),
// })
// export const selectExpensesSchema = createSelectSchema(expenses)
