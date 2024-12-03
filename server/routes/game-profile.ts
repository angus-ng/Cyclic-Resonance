import { Hono } from "hono"
import { getUser } from "../kinde"
import { db } from "../db"
import {
  gameProfile as gameProfileTable,
  insertGameProfileSchema,
} from "../db/schema/gameProfile"
import { eq, desc } from "drizzle-orm"
import { createGameProfileSchema } from "../sharedTypes"
import { zValidator } from "@hono/zod-validator"
import { defaultResources } from "../lib/resources"
import { resource } from "../db/schema/resource"

export const gameProfilesRoute = new Hono()
  .get("/", getUser, async (c) => {
    const user = c.var.user

    const gameProfiles = await db
      .select()
      .from(gameProfileTable)
      .where(eq(gameProfileTable.userId, user.id))
      .orderBy(desc(gameProfileTable.createdAt))

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
      const result = await db.transaction(async (tx) => {
        try {
          const gameProfile = await tx
            .insert(gameProfileTable)
            .values(validatedGameProfile)
            .returning()
            .then((res) => res[0])

          if (!gameProfile) {
            throw new Error("Failed to create game profile")
          }

          const resources = defaultResources[gameProfile.game].map(
            (resource) => ({
              gameProfileId: gameProfile.id,
              resourceName: resource.name,
              resourceType: resource.type,
              maxAmount: resource.maxAmount || null,
              currentAmount: 0,
            })
          )

          await tx.insert(resource).values(resources)

          return gameProfile
        } catch (err) {
          console.log(err)
          await tx.rollback()
        }
      })

      if (result) {
        return c.json(result)
      } else {
        throw new Error("Failed to create game profile")
      }
    }
  )
  .put(
    "/:id{[0-9]+}",
    getUser,
    zValidator("json", createGameProfileSchema),
    async (c) => {
      const gameProfile = await c.req.valid("json")
      const user = c.var.user
      const profileId = parseInt(c.req.param("id"))
      const validatedGameProfile = insertGameProfileSchema.parse({
        ...gameProfile,
        userId: user.id,
      })
      try {
        const result = await db
          .update(gameProfileTable)
          .set(validatedGameProfile)
          .where(eq(gameProfileTable.id, profileId))
          .returning()
          .then((res) => res[0])

        if (!result) {
          throw new Error("Failed to update game profile")
        }
        return c.json(result)
      } catch (err) {
        console.log(err)
        throw new Error("Failed to update game profile")
      }
    }
  )
