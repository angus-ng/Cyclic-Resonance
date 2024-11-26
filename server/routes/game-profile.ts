import { Hono } from "hono"
import { getUser } from "../kinde"
import { db } from "../db"
import {
  gameProfile as gameProfileTable,
  insertGameProfileSchema,
} from "../db/schema/gameProfile"
import { eq } from "drizzle-orm"
import { createGameProfileSchema } from "../sharedTypes"
import { zValidator } from "@hono/zod-validator"

export const gameProfilesRoute = new Hono()
  .get("/", getUser, async (c) => {
    const user = c.var.user

    const gameProfiles = await db
      .select()
      .from(gameProfileTable)
      .where(eq(gameProfileTable.userId, user.id))

    return c.json({ gameProfiles: gameProfiles })
  })
  .post(
    "/",
    getUser,
    zValidator("json", createGameProfileSchema),
    async (c) => {
      const gameProfile = await c.req.valid("json")
      const user = c.var.user

      const validatedGameProfile = insertGameProfileSchema.parse({
        ...gameProfile,
        userId: user.id,
      })

      const result = await db
        .insert(gameProfileTable)
        .values(validatedGameProfile)
        .returning()
        .then((res) => res[0])
      return c.json(result)
    }
  )
