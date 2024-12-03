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
export const regions = ["America", "Europe", "Asia", "TW, HK, MO"] as const
export const regionEnum = pgEnum("region", regions)
export type RegionName = (typeof regions)[number]

export const games = [
  "Genshin Impact",
  "Honkai Star Rail",
  "Zenless Zone Zero",
] as const
export const gameEnum = pgEnum("game", games)
export type GameName = (typeof games)[number]

export const gameProfile = pgTable(
  "game_profile",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    game: gameEnum().notNull(),
    ign: text("ign").notNull(),
    gameUID: text("game_uid").notNull(),
    region: regionEnum().notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (game_profile) => [index("user_gameProfile_idx").on(game_profile.userId)]
)

export type GameProfile = typeof gameProfile.$inferSelect

export const insertGameProfileSchema = createInsertSchema(gameProfile, {
  game: z.enum(games),
  ign: z.string().min(1, { message: "IGN cannot be empty" }),
  gameUID: z
    .string()
    .min(9, { message: "UID needs to be at least 9 characters" })
    .max(10, { message: "UID cannot exceed 10 characters" })
    .regex(/^[0-9]*$/, { message: "UID can only contain numeric characters" }),
  region: z.enum(regions),
})
export const selectGameProfileSchema = createSelectSchema(gameProfile)
