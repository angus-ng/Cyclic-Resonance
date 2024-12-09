import { z } from "zod"

import { insertExpensesSchema } from "./db/schema/expenses"
import { insertGameProfileSchema } from "./db/schema/gameProfile"
import { insertResourceSchema } from "./db/schema/resource"

export const createExpenseSchema = insertExpensesSchema.omit({
  userId: true,
  createdAt: true,
  id: true,
})

export type CreateExpense = z.infer<typeof createExpenseSchema>

export const createGameProfileSchema = insertGameProfileSchema.omit({
  userId: true,
  createdAt: true,
  id: true,
})

export type CreateGameProfile = z.infer<typeof createGameProfileSchema>

export const createResourceSchema = insertResourceSchema.omit({
  id: true,
  lastUpdated: true,
})

export type CreateResource = z.infer<typeof createResourceSchema>
