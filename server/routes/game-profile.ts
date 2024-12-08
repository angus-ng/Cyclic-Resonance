import { Hono } from "hono"
import { getUser } from "../kinde"
import { db } from "../db"
import {
  gameProfile as gameProfileTable,
  insertGameProfileSchema,
} from "../db/schema/gameProfile"
import { eq, desc, and, exists } from "drizzle-orm"
import { createGameProfileSchema } from "../sharedTypes"
import { zValidator } from "@hono/zod-validator"
import { defaultResources } from "../lib/resources"
import { resource as resourceTable } from "../db/schema/resource"

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

          await tx.insert(resourceTable).values(resources)

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
  .get("/:id{[0-9]+}", getUser, async (c) => {
    const user = c.var.user
    const profileId = parseInt(c.req.param("id"))
    try {
      const result = await db
        .select()
        .from(resourceTable)
        .where(
          and(
            eq(resourceTable.gameProfileId, profileId),
            exists(
              db
                .select()
                .from(gameProfileTable)
                .where(
                  and(
                    eq(gameProfileTable.id, resourceTable.gameProfileId),
                    eq(gameProfileTable.userId, user.id)
                  )
                )
            )
          )
        )

      if (!result) {
        throw new Error("Failed to select resource data")
      }
      return c.json(result)
    } catch (err) {
      console.log(err)
      throw new Error("Failed to select resource data")
    }
  })
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
  .delete("/:id{[0-9]+}", getUser, async (c) => {
    const id = Number.parseInt(c.req.param("id"))
    const user = c.var.user
    const expense = await db
      .delete(gameProfileTable)
      .where(
        and(eq(gameProfileTable.userId, user.id), eq(gameProfileTable.id, id))
      )
      .returning()
      .then((res) => res[0])
    if (!expense) {
      return c.notFound()
    }

    return c.json({ expense: expense })
  })
