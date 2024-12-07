import { deleteGameProfile, updateGameProfile } from "@/lib/api"
import {
  GameName,
  GameProfile,
  games,
  RegionName,
  regions,
} from "@server/db/schema/gameProfile"
import { useForm } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { toast } from "sonner"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { SquareX } from "lucide-react"
import { createGameProfileSchema } from "@server/sharedTypes"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Label } from "./ui/label"

const ProfileEditForm = ({
  profile,
  setEditModeProfileId,
}: {
  profile: GameProfile
  setEditModeProfileId: React.Dispatch<React.SetStateAction<number | null>>
}) => {
  const deleteMutation = useMutation({
    mutationFn: deleteGameProfile,
    onError: () => {
      toast("Error", {
        description: `Failed to delete game profile: ${profile.id}`,
      })
    },
    onSuccess: () => {
      toast("Game Profile Deleted", {
        description: `Successfully deleted game profile: ${profile.id}`,
      })
      queryClient.setQueryData(
        ["get-game-profiles"],
        (data: { gameProfiles: GameProfile[] }) => ({
          gameProfiles: data.gameProfiles.filter(
            (gameProfile) => gameProfile.id !== profile.id
          ),
        })
      )
      setEditModeProfileId(null)
    },
  })
  const handleDelete = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number
  ) => {
    event.preventDefault()

    deleteMutation.mutate({ id })
  }
  const handleCancelClick = () => {
    setEditModeProfileId(null)
  }
  const queryClient = useQueryClient()
  const updateMutation = useMutation({
    mutationFn: updateGameProfile,
    onError: () => {
      toast("Error", {
        description: `Failed to update game profile: ${profile.id}`,
      })
    },
    onSuccess: (updatedProfile) => {
      toast("Game Profile Updated", {
        description: `Successfully updated game profile : ${profile.id}`,
      })
      queryClient.setQueryData(
        ["get-game-profiles"],
        (data: { gameProfiles: GameProfile[] }) => {
          if (!Array.isArray(data.gameProfiles)) {
            return []
          }

          return {
            gameProfiles: data.gameProfiles.map((gameProfile) =>
              gameProfile.id === updatedProfile.id
                ? updatedProfile
                : gameProfile
            ),
          }
        }
      )
    },
  })
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      game: profile.game as GameName,
      ign: profile.ign,
      gameUID: profile.gameUID,
      region: profile.region as RegionName,
    },
    onSubmit: async ({ value }) => {
      try {
        await updateMutation.mutateAsync({
          id: profile.id,
          updatedGameProfile: value,
        })
        setEditModeProfileId(null)
      } catch (error) {
        console.error("Error updating profile", error)
      }
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
            Created At: {profile.createdAt.toLocaleDateString()}
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <>
                  <Button
                    type="submit"
                    className="mt-4 text-background"
                    disabled={!canSubmit}
                  >
                    {isSubmitting ? "Updating..." : "Update"}
                  </Button>
                  <button
                    disabled={!canSubmit}
                    onClick={(e) => handleDelete(e, profile.id)}
                    className="mt-4 text-accent font-semibold text-md"
                  >
                    Delete
                  </button>
                </>
              )}
            </form.Subscribe>
          </div>
        </CardFooter>
      </Card>
    </form>
  )
}

export default ProfileEditForm
