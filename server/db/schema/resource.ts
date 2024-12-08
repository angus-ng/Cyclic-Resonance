import {
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core"
import { gameProfile } from "./gameProfile"

export const ResourceType = ["Currency", "Stamina", "Progression"] as const
export const resourceTypeEnum = pgEnum("resource_type", ResourceType)

export const resource = pgTable(
  "resource",
  {
    id: serial("id").primaryKey(),
    gameProfileId: integer("game_profile_id")
      .notNull()
      .references(() => gameProfile.id, { onDelete: "cascade" }),
    resourceName: text("resourceName").notNull(),
    resourceType: resourceTypeEnum().notNull(),
    currentAmount: integer("current_amount").notNull().default(0),
    maxAmount: integer("max_amount"),
    lastUpdated: timestamp("last_updated").notNull().defaultNow(),
  },
  (resources) => [
    index("game_profile_idx").on(resources.gameProfileId),
    index("resource_name_idx").on(resources.resourceName),
  ]
)
