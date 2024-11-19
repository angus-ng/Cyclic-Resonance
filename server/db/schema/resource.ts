import {
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
} from "drizzle-orm/pg-core"
import { gameProfile } from "./gameProfile"

export const resourceEnum = pgEnum("resource_name", [
  "Primogems",
  "Resin",
  "Mora",
  "Stellar Jades",
  "Trailblaze Power",
  "Echo Passes",
])

export const resourceTypeEnum = pgEnum("resource_type", [
  "Currency",
  "Stamina",
  "Progression",
])

export const resource = pgTable(
  "resource",
  {
    id: serial("id").primaryKey(),
    gameProfileId: integer("game_profile_id")
      .notNull()
      .references(() => gameProfile.id),
    resourceName: resourceEnum().notNull(),
    resourceType: resourceTypeEnum().notNull(),
    currentAmount: integer("current_amount").notNull().default(0),
    maxAmount: integer("max_amount").default(0),
    lastUpdated: timestamp("last_updated").defaultNow(),
  },
  (resources) => [
    index("game_profile_idx").on(resources.gameProfileId),
    index("resource_name_idx").on(resources.resourceName),
  ]
)