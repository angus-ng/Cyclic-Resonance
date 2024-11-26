import { useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  createGameProfile,
  // getAllProfilesQueryOptions,
  // loadingCreateProfileQueryOptions,
} from "@/lib/api" // Import API functions
import { createGameProfileSchema } from "@server/sharedTypes" // Import Zod schema for validation
import { Input } from "@/components/ui/input" // Import custom UI components
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  GameName,
  games,
  RegionName,
  regions,
} from "@server/db/schema/gameProfile"

// The modal component itself
function CreateProfileModal({
  isOpen,
  closeModal,
}: {
  isOpen: boolean
  closeModal: () => void
}) {
  const queryClient = useQueryClient()

  // Set up the form using TanStack React Form
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      game: "Genshin Impact" as GameName, // Default value for game
      ign: "", // Default empty value for in-game name (IGN)
      gameUID: "", // Default empty value for game UID
      region: "America" as RegionName, // Default value for region
      createdAt: new Date().toISOString(), // Default value for date
    },
    onSubmit: async ({ value }) => {
      // const existingProfiles = await queryClient.ensureQueryData(
      //   getAllProfilesQueryOptions
      // )

      // // Set loading state
      // queryClient.setQueryData(loadingCreateProfileQueryOptions.queryKey, {
      //   profile: value,
      // })

      try {
        const newProfile = await createGameProfile({ value })

        // Update the profiles list in the cache
        // queryClient.setQueryData(getAllProfilesQueryOptions.queryKey, {
        //   ...existingProfiles,
        //   profiles: [newProfile, ...existingProfiles.profiles],
        // })

        // Notify user of success
        toast("Profile Created", {
          description: `Successfully created new profile: ${newProfile.id}`,
        })

        // Close the modal
        closeModal()
      } catch (e) {
        // Error handling
        console.log(e)
        toast("Error", {
          description: "Failed to create new profile",
        })
      } finally {
        // Reset loading state
        // queryClient.setQueryData(loadingCreateProfileQueryOptions.queryKey, {})
      }
    },
  })

  // If the modal is not open, return null
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={closeModal}
    >
      <div
        className="bg-background p-6 rounded-lg shadow-lg w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeModal}
          className="flex  w-full justify-end text-white"
        >
          X
        </button>
        <h2 className="text-xl font-bold mb-4">Create Game Profile</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          {/* Game Field */}
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

          {/* IGN Field */}
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

          {/* Game UID Field */}
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

          {/* Region Field */}
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

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                className="mt-4 text-background"
                disabled={!canSubmit}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </div>
    </div>
  )
}

export default CreateProfileModal
