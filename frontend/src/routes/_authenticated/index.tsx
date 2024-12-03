import { createFileRoute } from "@tanstack/react-router"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { getAllGameProfilesOptions } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import ProfileModal from "@/components/ui/profileModal"
import { useState } from "react"
import { SquareX, UserRoundPen } from "lucide-react"
import { useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import {
  GameName,
  GameProfile,
  games,
  RegionName,
  regions,
} from "@server/db/schema/gameProfile"
import { useQueryClient } from "@tanstack/react-query"
import { Label } from "@/components/ui/label"
import { createGameProfileSchema } from "@server/sharedTypes"
import { Input } from "@/components/ui/input"

export const Route = createFileRoute("/_authenticated/")({
  component: Index,
})

// async function getGameProfiles() {
//   const res = await api["game-profiles"].$get()
//   if (!res.ok) {
//     throw new Error("server error")
//   }
//   const data = await res.json()
//   return data
// }

function Index() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editModeProfileId, setEditModeProfileId] = useState<number | null>(
    null
  )

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)
  const handleEditClick = (profileId: number | null) => {
    setEditModeProfileId((prevProfileId) =>
      prevProfileId === profileId ? null : profileId
    )
  }

  const { isLoading, error, data } = useQuery(getAllGameProfilesOptions)
  if (error) return "An error has occurred: " + error.message

  return (
    <>
      <div className="min-h-full bg-background text-text p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gacha Dashboard</h1>
          <Button
            className="bg-primary text-background hover:bg-accent"
            onClick={openModal}
          >
            Create New Profile
          </Button>
        </div>

        {!isLoading ? (
          <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
            {data && data.gameProfiles.length > 0 ? (
              data.gameProfiles.map((profile) =>
                editModeProfileId === profile.id ? (
                  <ProfileEditForm
                    key={profile.id}
                    profile={profile}
                    setEditModeProfileId={setEditModeProfileId}
                  />
                ) : (
                  <Card
                    key={profile.id}
                    className="flex flex-col w-72 p-4 bg-background border border-secondary rounded-lg hover:ring-2 hover:ring-accent transition-all duration-200"
                  >
                    <UserRoundPen
                      className="flex flex-row self-end"
                      onClick={() => handleEditClick(profile.id)}
                    />
                    <CardHeader className="flex flex-row justify-center items-center text-center w-full">
                      <h2 className="text-xl font-bold text-text">
                        {profile.game}
                      </h2>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                      <p className="text-secondary">IGN: {profile.ign}</p>
                      <p className="text-secondary">
                        Game UID: {profile.gameUID}
                      </p>
                      <p className="text-secondary">Region: {profile.region}</p>
                    </CardContent>
                    <CardFooter className="mt-4 text-sm text-secondary text-center flex justify-center items-center">
                      Created At:{" "}
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </CardFooter>
                  </Card>
                )
              )
            ) : (
              <div className="flex justify-center items-center w-full h-64">
                <p className="text-secondary">
                  No profiles found. Create one to get started!
                </p>
              </div>
            )}
          </div>
        ) : (
          <div>Loading...</div>
        )}
        <ProfileModal isOpen={isModalOpen} closeModal={closeModal} />
      </div>
    </>
  )
}

const ProfileEditForm = ({
  profile,
  setEditModeProfileId,
}: {
  profile: GameProfile
  setEditModeProfileId: React.Dispatch<React.SetStateAction<number | null>>
}) => {
  const handleCancelClick = () => {
    setEditModeProfileId(null)
  }
  const queryClient = useQueryClient()
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      game: profile.game as GameName,
      ign: profile.ign,
      gameUID: profile.gameUID,
      region: profile.region as RegionName,
    },
    onSubmit: async ({ value }) => {
      console.log("GG")
      setEditModeProfileId(null)
    },
  })
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <Card
        key={profile.id}
        className="flex flex-col w-72 p-4 bg-background border border-secondary rounded-lg hover:ring-2 hover:ring-accent transition-all duration-200"
      >
        <SquareX
          className="flex flex-row self-end"
          onClick={handleCancelClick}
        />
        <CardHeader className="flex flex-row justify-center items-center text-center w-full">
          <form.Field
            name="game"
            validators={{ onChange: createGameProfileSchema.shape.game }}
          >
            {(field) => (
              <div className="mb-2">
                <Label htmlFor={field.name}>Game</Label>
                <select
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(e.target.value as GameName)
                  }
                  className="block w-full p-2 border border-gray-300 rounded-md bg-background text-text"
                >
                  {games.map((game) => {
                    return (
                      <option key={game} value={game}>
                        {game}
                      </option>
                    )
                  })}
                </select>
                {field.state.meta.isTouched &&
                field.state.meta.errors.length ? (
                  <em className="text-red-500">
                    {field.state.meta.errors.join(", ")}
                  </em>
                ) : null}
              </div>
            )}
          </form.Field>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <form.Field
            name="ign"
            validators={{ onChange: createGameProfileSchema.shape.ign }}
          >
            {(field) => (
              <>
                <div className="mb-2">
                  <Label htmlFor={field.name}>IGN</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    placeholder="Display Name"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="placeholder:text-text/40"
                  />
                  {field.state.meta.isTouched &&
                  field.state.meta.errors.length ? (
                    <em>{field.state.meta.errors.join(", ")}</em>
                  ) : null}
                </div>
              </>
            )}
          </form.Field>
          <form.Field
            name="gameUID"
            validators={{ onChange: createGameProfileSchema.shape.gameUID }}
          >
            {(field) => (
              <>
                <div className="mb-2">
                  <Label htmlFor={field.name}>Game UID</Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="0000000000"
                    className="placeholder:text-text/40"
                  />
                  {field.state.meta.isTouched &&
                  field.state.meta.errors.length ? (
                    <em>{field.state.meta.errors.join(", ")}</em>
                  ) : null}
                </div>
              </>
            )}
          </form.Field>
          <form.Field
            name="region"
            validators={{ onChange: createGameProfileSchema.shape.region }}
          >
            {(field) => (
              <div className="mb-2">
                <Label htmlFor={field.name}>Game</Label>
                <select
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(e.target.value as RegionName)
                  }
                  className="block w-full p-2 border border-gray-300 rounded-md bg-background text-text"
                >
                  {regions.map((region) => {
                    return (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    )
                  })}
                </select>
                {field.state.meta.isTouched &&
                field.state.meta.errors.length ? (
                  <em className="text-red-500">
                    {field.state.meta.errors.join(", ")}
                  </em>
                ) : null}
              </div>
            )}
          </form.Field>
        </CardContent>
        <CardFooter className="mt-4 text-sm text-secondary text-center flex justify-center items-center">
          <div className="flex flex-col">
            Created At: {new Date(profile.createdAt).toLocaleDateString()}
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  className="mt-4 text-background"
                  disabled={!canSubmit}
                >
                  {isSubmitting ? "Updating..." : "Update"}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </CardFooter>
      </Card>
    </form>
  )
}
