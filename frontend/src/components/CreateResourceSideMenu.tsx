import { useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createResource, getProfileResources } from "@/lib/api"
import { createResourceSchema } from "@server/sharedTypes" // You need to create this schema if not already created
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ResourceType, ResourceTypeSelect } from "@server/db/schema/resource"
import { SquareX } from "lucide-react"

function CreateResourceSideMenu({
  isOpen,
  closeMenu,
  id,
}: {
  isOpen: boolean
  closeMenu: () => void
  id: number
}) {
  const queryClient = useQueryClient()

  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      gameProfileId: id,
      resourceName: "",
      resourceType: "Currency" as ResourceTypeSelect,
      currentAmount: 0,
      maxAmount: "",
      lastUpdated: new Date().toISOString(),
    },
    onSubmit: async ({ value }) => {
      try {
        //@ts-expect-error
        const newResource = await createResource({ value, id })

        toast("Resource Created", {
          description: `Successfully created new resource: ${newResource.resourceName}`,
        })
        queryClient.setQueryData(
          ["get-profile-resources", id],
          (oldData: any) => {
            if (!oldData) return [newResource]
            return [...oldData, newResource]
          }
        )

        closeMenu()
        form.reset()
      } catch (e) {
        console.error(e)
        toast("Error", {
          description: "Failed to create new resource",
        })
      } finally {
        queryClient.setQueryData(["loading-create-resource"], [])
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
      <h2 className="text-xl font-bold mb-4">Create Resource</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.Field
          name="resourceName"
          validators={{ onChange: createResourceSchema.shape.resourceName }}
        >
          {(field) => (
            <div className="mb-2">
              <Label htmlFor={field.name}>Resource Name</Label>
              <Input
                id={field.name}
                name={field.name}
                placeholder="Resource Name"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="placeholder:text-text/40"
              />
              {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <em className="text-red-500">
                  {field.state.meta.errors.join(", ")}
                </em>
              ) : null}
            </div>
          )}
        </form.Field>

        <form.Field
          name="resourceType"
          validators={{ onChange: createResourceSchema.shape.resourceType }}
        >
          {(field) => (
            <div className="mb-2">
              <Label htmlFor={field.name}>Resource Type</Label>
              <select
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) =>
                  field.handleChange(e.target.value as ResourceTypeSelect)
                }
                className="block w-full p-2 border border-gray-300 rounded-md bg-background text-text"
              >
                {ResourceType.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
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
          name="currentAmount"
          validators={{ onChange: createResourceSchema.shape.currentAmount }}
        >
          {(field) => (
            <div className="mb-2">
              <Label htmlFor={field.name}>Current Amount</Label>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                className="placeholder:text-text/40"
              />
              {field.state.meta.isTouched && field.state.meta.errors.length ? (
                <em className="text-red-500">
                  {field.state.meta.errors.join(", ")}
                </em>
              ) : null}
            </div>
          )}
        </form.Field>

        <form.Field
          name="maxAmount"
          validators={{ onChange: createResourceSchema.shape.maxAmount }}
        >
          {(field) => (
            <div className="mb-2">
              <Label htmlFor={field.name}>Max Amount</Label>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className="placeholder:text-text/40"
              />
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

export default CreateResourceSideMenu
