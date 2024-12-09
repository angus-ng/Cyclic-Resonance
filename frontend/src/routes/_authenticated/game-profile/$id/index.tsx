import CreateResourceSideMenu from "@/components/CreateResourceSideMenu"
import ResourceEditForm from "@/components/ResourceEditForm"
import ResourcesSkeleton from "@/components/skeletons/ResourcesSkeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { getProfileResourcesOptions } from "@/lib/api"
import { ResourceType } from "@server/db/schema/resource"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { formatDistanceToNow } from "date-fns"
import { useState } from "react"

export const Route = createFileRoute("/_authenticated/game-profile/$id/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const openSideMenu = () => setIsMenuOpen(true)
  const closeSideMenu = () => setIsMenuOpen(false)
  const { isLoading, error, data } = useQuery(
    getProfileResourcesOptions(parseInt(id))
  )
  if (error) return "An error has occurred: " + error.message
  const [selectedResourceType, setSelectedResourceType] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [editModeResourceId, setEditModeResourceId] = useState<number | null>(
    null
  )
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    setSelectedResourceType(value)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const filteredResources = data?.filter((resource) => {
    const matchesType =
      !selectedResourceType || resource.resourceType === selectedResourceType
    const matchesName = resource.resourceName
      .toLowerCase()
      .includes(searchQuery.toLowerCase())

    return matchesType && matchesName
  })

  const getResourceBadgeClass = (resourceType: string) => {
    switch (resourceType) {
      case "Currency":
        return "bg-yellow-100 text-yellow-800 border-yellow-300 "
      case "Stamina":
        return "bg-green-100 text-green-800 border-green-300"
      case "Progression":
        return "bg-blue-100 text-blue-800 border-blue-300"
      default:
        return ""
    }
  }

  return (
    <>
      <SubNav id={id} />
      <div className="min-h-full bg-background text-text p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6 gap-x-6">
          <div className="flex flex-col gap-2">
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
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by name"
              className="mt-2 p-2 border border-gray-300 rounded-md bg-background text-text focus:ring-2 focus:ring-accent"
            />
          </div>
          <Button
            className="bg-primary text-background hover:bg-accent"
            onClick={openSideMenu}
          >
            Add Resource
          </Button>
        </div>
        {!isLoading ? (
          <div className="flex flex-wrap gap-4 justify-start">
            {filteredResources?.map((resource) =>
              editModeResourceId === resource.id ? (
                <ResourceEditForm
                  key={resource.id}
                  resource={{
                    ...resource,
                    lastUpdated: new Date(resource.lastUpdated),
                  }}
                  setEditModeResourceId={setEditModeResourceId}
                />
              ) : (
                <Card
                  key={resource.id}
                  className="w-full min-w-sm max-w-sm bg-background rounded-lg shadow-lg flex flex-col justify-start hover:ring-2 hover:ring-accent transition-all duration-200 transform hover:scale-105 hover:shadow-2xl"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-text">
                        {resource.resourceName}
                      </h2>
                      <Badge
                        className={`text-sm ${getResourceBadgeClass(resource.resourceType)}`}
                        variant="outline"
                      >
                        {resource.resourceType}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-gray-400">
                        <span>Current Amount: </span>
                        <span
                          className={
                            resource.currentAmount === 0
                              ? "text-secondary"
                              : "text-primary"
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
                            className={`${
                              resource.currentAmount > resource.maxAmount
                                ? "bg-red-400"
                                : "bg-primary"
                            } h-2 rounded-full`}
                            style={{
                              width: `${Math.min((resource.currentAmount / resource.maxAmount) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      )}
                      <div className="text-xs text-gray-500">
                        Last updated:{" "}
                        {formatDistanceToNow(new Date(resource.lastUpdated))}{" "}
                        ago
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full text-sm bg-primary text-background hover:bg-accent hover:text-background-lighter transition-all duration-200"
                      onClick={() => setEditModeResourceId(resource.id)} // Trigger edit mode on click
                    >
                      Manage
                    </Button>
                  </CardFooter>
                </Card>
              )
            )}
          </div>
        ) : (
          <ResourcesSkeleton count={6} />
        )}
        <CreateResourceSideMenu
          isOpen={isMenuOpen}
          closeMenu={closeSideMenu}
          id={parseInt(id)}
        />
      </div>
    </>
  )
}

export function SubNav({ id }: { id: string }) {
  return (
    <div className="w-full bg-background border-t border-t-primary mt-16">
      <nav className="flex justify-start gap-8 p-4 text-text">
        <Link
          to={`/game-profile/${id}`}
          className="relative text-text hover:text-accent group [&.active]:text-accent"
        >
          <span className="group-hover:translate-x-2 transition-transform duration-300">
            Resources
          </span>
          <div className="absolute left-0 w-0 h-1 bg-accent group-hover:w-full transition-all duration-300"></div>
        </Link>
        <Link
          to={`/game-profile/${id}/screenshots`}
          className="relative text-text hover:text-accent group [&.active]:text-accent"
        >
          <span className="group-hover:translate-x-2 transition-transform duration-300">
            Screenshots
          </span>
          <div className="absolute left-0 w-0 h-1 bg-accent group-hover:w-full transition-all duration-300"></div>
        </Link>
      </nav>
    </div>
  )
}
