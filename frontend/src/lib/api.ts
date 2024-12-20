import { hc } from "hono/client"
import { type ApiRoutes } from "@server/app"
import { queryOptions } from "@tanstack/react-query"
import { CreateGameProfile, CreateResource } from "@server/sharedTypes"

const client = hc<ApiRoutes>("/")
export const api = client.api

async function getCurrentUser() {
  const res = await api.me.$get()
  if (!res.ok) {
    throw new Error("server error")
  }
  const data = await res.json()
  return data
}

export const userQueryOptions = queryOptions({
  queryKey: ["get-current-user"],
  queryFn: getCurrentUser,
  staleTime: Infinity,
})

export async function updateGameProfile({
  id,
  updatedGameProfile,
}: {
  id: number
  updatedGameProfile: CreateGameProfile
}) {
  const res = await api["game-profiles"][":id{[0-9]+}"].$put({
    param: { id: id.toString() },
    json: updatedGameProfile,
  })

  if (!res.ok) {
    throw new Error("Server error during update")
  }

  return res.json()
}

export async function getAllGameProfiles() {
  const res = await api["game-profiles"].$get()
  if (!res.ok) {
    throw new Error("server error")
  }
  const data = await res.json()
  return data
}

export const getAllGameProfilesOptions = queryOptions({
  queryKey: ["get-game-profiles"],
  queryFn: getAllGameProfiles,
  staleTime: 1000 * 60 * 5,
})

export const loadingCreateGameProfilesOptions = queryOptions<{
  gameProfiles: CreateGameProfile[]
}>({
  queryKey: ["loading-create-game-profiles"],
  queryFn: getAllGameProfiles,
  staleTime: Infinity,
})

export async function createGameProfile({
  value,
}: {
  value: CreateGameProfile
}) {
  const res = await api["game-profiles"].$post({ json: value })
  if (!res.ok) {
    throw new Error("Server error")
  }
  const newGameProfile = await res.json()
  return newGameProfile
}

export async function deleteGameProfile({ id }: { id: number }) {
  const res = await api["game-profiles"][":id{[0-9]+}"].$delete({
    param: { id: id.toString() },
  })

  if (!res.ok) {
    throw new Error("server error")
  }
}

export async function getProfileResources({ id }: { id: number }) {
  const res = await api["game-profiles"][":id{[0-9]+}"].$get({
    param: { id: id.toString() },
  })
  if (!res.ok) {
    throw new Error("server error")
  }
  const data = await res.json()
  return data
}

export const getProfileResourcesOptions = (profileId: number) =>
  queryOptions({
    queryKey: ["get-profile-resources", profileId],
    queryFn: () => getProfileResources({ id: profileId }),
    staleTime: 1000 * 60 * 5,
  })

export async function deleteResource({
  id,
  resourceId,
}: {
  id: number
  resourceId: number
}) {
  const res = await api["game-profiles"][":id{[0-9]+}"].resources[
    ":resourceId{[0-9]+}"
  ].$delete({
    param: { id: id.toString(), resourceId: resourceId.toString() },
  })

  if (!res.ok) {
    throw new Error("server error")
  }
}

export async function updateResource({
  id,
  resourceId,
  updatedResource,
}: {
  id: number
  resourceId: number
  updatedResource: CreateResource
}) {
  const res = await api["game-profiles"][":id{[0-9]+}"].resources[
    ":resourceId{[0-9]+}"
  ].$put({
    param: { id: id.toString(), resourceId: resourceId.toString() },
    json: updatedResource,
  })

  if (!res.ok) {
    throw new Error("Server error during update")
  }

  return res.json()
}

export async function createResource({
  value,
  id,
}: {
  value: CreateResource
  id: number
}) {
  const res = await api["game-profiles"][":id{[0-9]+}"].resources.$post({
    param: { id: id.toString() },
    json: value,
  })
  if (!res.ok) {
    throw new Error("Server error")
  }
  const newResource = await res.json()
  return newResource
}
