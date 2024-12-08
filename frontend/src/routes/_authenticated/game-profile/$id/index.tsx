import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { getProfileResourcesOptions } from "@/lib/api"
import { ResourceType } from "@server/db/schema/resource"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { formatDistanceToNow } from "date-fns"
import { ChevronLeft } from "lucide-react"
import { useState } from "react"

export const Route = createFileRoute("/_authenticated/game-profile/$id/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()

  const { isLoading, error, data } = useQuery(
    getProfileResourcesOptions(parseInt(id))
  )
  if (error) return "An error has occurred: " + error.message
  const [selectedResourceType, setSelectedResourceType] = useState<string>("")

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    setSelectedResourceType(value)
  }
  const filteredResources = selectedResourceType
    ? data?.filter((resource) => resource.resourceType === selectedResourceType)
    : data
  return (
    <>
      <div className="min-h-full bg-background text-text p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6 gap-x-6">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex text-xl justify-start items-center">
              <ChevronLeft /> Home
            </Link>
            <h1 className="text-3xl font-bold">Resources</h1>
          </div>
          <div className="flex gap-2 justify-center items-center">
            <label
              htmlFor="resource-type"
              className="text-lg font-semibold text-text"
            >
              Resource Type:
            </label>
            <select
              id="resource-type"
              name="resource-type"
              value={selectedResourceType}
              onChange={handleChange}
              className="mt-2 p-2 border border-gray-300 rounded-md bg-background text-text focus:ring-2 focus:ring-accent"
            >
              <option value="">All</option>
              {ResourceType.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <Button
            className="bg-primary text-background hover:bg-accent"
            // onClick={openSideMenu}
          >
            Add Resource
          </Button>
        </div>
        <div className="flex flex-wrap gap-4 justify-start">
          {filteredResources?.map((resource) => (
            <Card
              key={resource.id}
              className="w-full max-w-sm bg-background rounded-lg shadow-lg flex flex-col justify-center hover:ring-2 hover:ring-accent transition-all duration-200"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-text">
                    {resource.resourceName}
                  </h2>
                  <Badge className="text-sm" variant="outline">
                    {resource.resourceType}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-gray-400">
                    <span>Current Amount:</span>{" "}
                    <span
                      className={
                        resource.currentAmount === 0
                          ? "text-red-500"
                          : "text-green-500"
                      }
                    >
                      {resource.currentAmount}
                    </span>
                  </div>
                  {resource.maxAmount && (
                    <div className="text-sm text-gray-400">
                      <span>Max Amount:</span> {resource.maxAmount}
                    </div>
                  )}
                  {resource.maxAmount && (
                    <div className="w-full bg-background-lighter rounded-full h-2 mt-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${(resource.currentAmount / resource.maxAmount) * 100}%`,
                        }}
                      />
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    Last updated:{" "}
                    {formatDistanceToNow(new Date(resource.lastUpdated))} ago
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full text-sm bg-primary text-background hover:bg-accent hover:text-background-lighter transition-all duration-200"
                >
                  Manage
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
