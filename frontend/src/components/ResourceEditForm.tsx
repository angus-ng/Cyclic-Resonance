import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { deleteResource, updateResource } from "@/lib/api"
import {
  Resource,
  ResourceType,
  ResourceTypeSelect,
} from "@server/db/schema/resource"
import { useForm } from "@tanstack/react-form"
import { zodValidator } from "@tanstack/zod-form-adapter"
import { SquareX } from "lucide-react"
import { createResourceSchema } from "@server/sharedTypes"

const ResourceEditForm = ({
  resource,
  setEditModeResourceId,
}: {
  resource: Resource
  setEditModeResourceId: React.Dispatch<React.SetStateAction<number | null>>
}) => {
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: deleteResource,
    onError: () => {
      toast("Error", {
        description: `Failed to delete resource: ${resource.id}`,
      })
    },
    onSuccess: () => {
      toast("Resource Deleted", {
        description: `Successfully deleted resource: ${resource.id}`,
      })
      queryClient.setQueryData(
        ["get-profile-resources", resource.gameProfileId],
        (data: Resource[]) => {
          return data.filter((r) => resource.id !== r.id)
        }
      )
      setEditModeResourceId(null)
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateResource,
    onError: () => {
      toast("Error", {
        description: `Failed to update resource: ${resource.id}`,
      })
    },
    onSuccess: (updatedResource) => {
      toast("Resource Updated", {
        description: `Successfully updated resource: ${resource.id}`,
      })
      queryClient.setQueryData(
        ["get-profile-resources", resource.gameProfileId],
        (data: { resources: Resource[] }) => {
          if (!Array.isArray(data)) {
            return []
          }

          const updatedResources = data.map((resource) =>
            resource.id === updatedResource.id ? updatedResource : resource
          )
          return updatedResources
        }
      )
      setEditModeResourceId(null)
    },
  })

  const handleDelete = (
    e: React.MouseEvent<HTMLButtonElement>,
    id: number,
    resourceId: number
  ) => {
    e.preventDefault()
    deleteMutation.mutate({ id, resourceId })
  }

  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      gameProfileId: resource.gameProfileId,
      resourceName: resource.resourceName,
      resourceType: resource.resourceType,
      currentAmount: resource.currentAmount,
      maxAmount: resource.maxAmount || "",
    },
    onSubmit: async (data) => {
      try {
        await updateMutation.mutateAsync({
          id: resource.gameProfileId,
          resourceId: resource.id,
          //@ts-expect-error
          updatedResource: data.value,
        })
      } catch (error) {
        console.error("Error updating resource", error)
      }
    },
  })

  return (
    <Card className="w-full min-w-sm max-w-sm bg-background rounded-lg shadow-lg hover:ring-2 hover:ring-accent transition-all duration-200 transform hover:scale-105 hover:shadow-2xl">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-text">Edit Resource</h2>
            <SquareX
              className="flex flex-row self-end"
              onClick={() => setEditModeResourceId(null)}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <form.Field
            name="resourceName"
            validators={{ onChange: createResourceSchema.shape.resourceName }}
          >
            {(field) => (
              <div>
                <Label htmlFor={field.name}>Resource Name</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="mt-2"
                />
                {field.state.meta.isTouched &&
                field.state.meta.errors.length ? (
                  <em className="text-accent">
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
              <div>
                <Label htmlFor="resourceType">Resource Type</Label>
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
                  {ResourceType.map((type) => {
                    return (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    )
                  })}
                </select>
                {field.state.meta.isTouched &&
                field.state.meta.errors.length ? (
                  <em className="text-accent">
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
              <div>
                <Label htmlFor="currentAmount">Current Amount</Label>
                <Input
                  min="0"
                  type="number"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  className="mt-2"
                />
                {field.state.meta.isTouched &&
                field.state.meta.errors.length ? (
                  <em className="text-accent">
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
              <div>
                <Label htmlFor="maxAmount">Max Amount</Label>
                <Input
                  type="number"
                  min="0"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    const value =
                      e.target.value === "" ? "" : Number(e.target.value)
                    field.setValue(value)
                  }}
                  className="mt-2"
                />
                {field.state.meta.isTouched &&
                field.state.meta.errors.length ? (
                  <em className="text-accent">
                    {field.state.meta.errors.join(", ")}
                  </em>
                ) : null}
              </div>
            )}
          </form.Field>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <>
                <Button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full bg-primary text-background hover:bg-accent"
                >
                  {isSubmitting ? "Updating..." : "Update"}
                </Button>
                <button
                  onClick={(e) =>
                    handleDelete(e, resource.gameProfileId, resource.id)
                  }
                  className="text-accent font-semibold text-sm"
                >
                  Delete
                </button>
              </>
            )}
          </form.Subscribe>
        </CardFooter>
      </form>
    </Card>
  )
}

export default ResourceEditForm
