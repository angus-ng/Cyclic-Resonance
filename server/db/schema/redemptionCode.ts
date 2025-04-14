import {
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core"
import { gameProfile } from "./gameProfile"

//FUTURE: Update this at some point so duplicate codes aren't stored multiple times in db.
export const redemptionCode = pgTable(
  "redemption_code",
  {
    id: serial("id").primaryKey(),
    gameProfileId: integer("game_profile_id")
      .notNull()
      .references(() => gameProfile.id, { onDelete: "cascade" }),
    code: text("code").notNull(),
    redeemedAt: timestamp("redeemed_at").notNull().defaultNow(),
  },
  (redemptionCode) => [
    unique("code_gameProfileId_constraint").on(
      redemptionCode.code,
      redemptionCode.gameProfileId
    ),
    index("code_gameProfileId_idx").on(redemptionCode.gameProfileId),
    index("code_id_idx").on(redemptionCode.id),
  ]
)
