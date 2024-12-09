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
import { createInsertSchema } from "drizzle-zod"
import { z } from "zod"

export const ResourceType = ["Currency", "Stamina", "Progression"] as const
export const resourceTypeEnum = pgEnum("resource_type", ResourceType)
export type ResourceTypeSelect = (typeof ResourceType)[number]

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

export type Resource = typeof resource.$inferSelect

export const insertResourceSchema = createInsertSchema(resource, {
  gameProfileId: z.number(),
  resourceName: z.string().min(1, { message: "Resource Name cannot be empty" }),
  resourceType: z.enum(ResourceType),
  currentAmount: z.number().min(0),
  maxAmount: z
    .union([z.string(), z.number()])
    .transform((value) => {
      if (value === "" || value === undefined) {
        return null
      }
      return Number(value)
    })
    .refine(
      (value) => value === null || (Number.isInteger(value) && value >= 0),
      { message: "Max Amount must be a positive integer or null" }
    )
    .optional(),
})
