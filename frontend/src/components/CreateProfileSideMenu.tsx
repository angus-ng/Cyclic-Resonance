import { useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createGameProfile, getAllGameProfilesOptions } from "@/lib/api"
import { createGameProfileSchema } from "@server/sharedTypes"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  GameName,
  Games,
  RegionName,
  regions,
} from "@server/db/schema/gameProfile"
import { SquareX } from "lucide-react"

function CreateProfileSideMenu({
  isOpen,
  closeMenu,
}: {
  isOpen: boolean
  closeMenu: () => void
}) {
  const queryClient = useQueryClient()

  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      game: "Genshin Impact" as GameName,
      ign: "",
      gameUID: "",
      region: "America" as RegionName,
      createdAt: new Date().toISOString(),
    },
    onSubmit: async ({ value }) => {
      const existingProfiles = await queryClient.ensureQueryData(
        getAllGameProfilesOptions
      )

      queryClient.setQueryData(["loading-create-game-profiles"], {
        gameProfile: value,
      })

      try {
        const newProfile = await createGameProfile({ value })

        queryClient.setQueryData(getAllGameProfilesOptions.queryKey, {
          ...existingProfiles,
          gameProfiles: [newProfile, ...existingProfiles.gameProfiles],
        })

        toast("Profile Created", {
          description: `Successfully created new profile: ${newProfile.id}`,
        })

        closeMenu()
        form.reset()
      } catch (e) {
        console.log(e)
        toast("Error", {
          description: "Failed to create new profile",
        })
      } finally {
        queryClient.setQueryData(["loading-create-game-profiles"], [])
      }
    },
  })

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-background shadow-lg w-96 p-6 transform transition-transform duration-700 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <button onClick={closeMenu} className="absolute top-4 right-4">
        <SquareX className="flex flex-row self-end" />
      </button>
      <h2 className="text-xl font-bold mb-4">Create Game Profile</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
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
                onChange={(e) => field.handleChange(e.target.value as GameName)}
                className="block w-full p-2 border border-gray-300 rounded-md bg-background text-text"
              >
                {Games.map((game) => {
                  return (
                    <option key={game} value={game}>
                      {game}
                    </option>
                  )
                })}
              </select>
              {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <em className="text-red-500">
                  {field.state.meta.errors.join(", ")}
                </em>
              ) : null}
            </div>
          )}
        </form.Field>
        <form.Field
          name="ign"
          validators={{ onChange: createGameProfileSchema.shape.ign }}
        >
          {(field) => (
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
              {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <em>{field.state.meta.errors.join(", ")}</em>
              ) : null}
            </div>
          )}
        </form.Field>

        <form.Field
          name="gameUID"
          validators={{ onChange: createGameProfileSchema.shape.gameUID }}
        >
          {(field) => (
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
              {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <em>{field.state.meta.errors.join(", ")}</em>
              ) : null}
            </div>
          )}
        </form.Field>
        <form.Field
          name="region"
          validators={{ onChange: createGameProfileSchema.shape.region }}
        >
          {(field) => (
            <div className="mb-2">
              <Label htmlFor={field.name}>Region</Label>
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
              {field.state.meta.isTouched && field.state.meta.errors.length ? (
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
  )
}

export default CreateProfileSideMenu
