import { Hono } from "hono"
import { getUser } from "../kinde"
import { db } from "../db"
import {
  gameProfile as gameProfileTable,
  insertGameProfileSchema,
} from "../db/schema/gameProfile"
import { eq, desc, and, exists } from "drizzle-orm"
import { createGameProfileSchema, createResourceSchema } from "../sharedTypes"
import { zValidator } from "@hono/zod-validator"
import { defaultResources } from "../lib/resources"
import {
  insertResourceSchema,
  resource as resourceTable,
} from "../db/schema/resource"

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
    const gameProfile = await db
      .delete(gameProfileTable)
      .where(
        and(eq(gameProfileTable.userId, user.id), eq(gameProfileTable.id, id))
      )
      .returning()
      .then((res) => res[0])
    if (!gameProfile) {
      return c.notFound()
    }

    return c.json({ gameProfile: gameProfile })
  })
  .delete("/:id{[0-9]+}/resources/:resourceId{[0-9]+}", getUser, async (c) => {
    const gameProfileId = Number.parseInt(c.req.param("id"))
    const user = c.var.user
    const resourceId = Number.parseInt(c.req.param("resourceId"))

    try {
      const ownership = await db
        .select()
        .from(gameProfileTable)
        .where(
          and(
            eq(gameProfileTable.userId, user.id),
            eq(gameProfileTable.id, gameProfileId)
          )
        )
      if (!ownership || !ownership.length) {
        throw new Error("Failed to update resource")
      }
      const resource = await db
        .delete(resourceTable)
        .where(
          and(
            eq(resourceTable.gameProfileId, gameProfileId),
            eq(resourceTable.id, resourceId)
          )
        )
        .returning()
        .then((res) => res[0])
      if (!resource) {
        return c.notFound()
      }

      return c.json({ resource: resource })
    } catch (err) {
      console.log(err)
      throw new Error("Failed to update resource")
    }
  })
  .put(
    "/:id{[0-9]+}/resources/:resourceId{[0-9]+}",
    getUser,
    zValidator("json", createResourceSchema),
    async (c) => {
      const resource = await c.req.valid("json")
      const user = c.var.user
      const gameProfileId = parseInt(c.req.param("id"))
      const resourceId = parseInt(c.req.param("resourceId"))
      const validatedResource = insertResourceSchema.parse({
        ...resource,
        id: resourceId,
        lastUpdated: new Date(Date.now()),
      })
      try {
        const ownership = await db
          .select()
          .from(gameProfileTable)
          .where(
            and(
              eq(gameProfileTable.userId, user.id),
              eq(gameProfileTable.id, gameProfileId)
            )
          )
        if (!ownership || !ownership.length) {
          throw new Error("Failed to update resource")
        }

        const result = await db
          .update(resourceTable)
          .set(validatedResource)
          .where(
            and(
              eq(resourceTable.id, resourceId),
              eq(resourceTable.gameProfileId, gameProfileId)
            )
          )
          .returning()
          .then((res) => res[0])

        if (!result) {
          throw new Error("Failed to update resource")
        }
        return c.json(result)
      } catch (err) {
        console.log(err)
        throw new Error("Failed to update resource")
      }
    }
  )
  .post(
    "/:id{[0-9]+}/resources",
    getUser,
    zValidator("json", createResourceSchema),
    async (c) => {
      const resource = await c.req.valid("json")
      const user = c.var.user
      const gameProfileId = parseInt(c.req.param("id"))

      const ownership = await db
        .select()
        .from(gameProfileTable)
        .where(
          and(
            eq(gameProfileTable.userId, user.id),
            eq(gameProfileTable.id, gameProfileId)
          )
        )
      if (!ownership || !ownership.length) {
        throw new Error("Failed to update resource")
      }

      const validatedResource = insertResourceSchema.parse({
        ...resource,
        userId: user.id,
      })

      const result = await db
        .insert(resourceTable)
        .values(validatedResource)
        .returning()
        .then((res) => res[0])
      c.status(201)
      return c.json(result)
    }
  )
