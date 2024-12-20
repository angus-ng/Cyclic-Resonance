import { createFileRoute, Link } from "@tanstack/react-router"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

import { getAllGameProfilesOptions } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import CreateProfileSideMenu from "@/components/CreateProfileSideMenu"
import { useState } from "react"
import { UserRoundPen } from "lucide-react"
import ProfileEditForm from "@/components/ProfileEditForm"
import GameProfileSkeleton from "@/components/skeletons/GameProfileSkeleton"

export const Route = createFileRoute("/_authenticated/")({
  component: Index,
})

function Index() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [editModeProfileId, setEditModeProfileId] = useState<number | null>(
    null
  )

  const openSideMenu = () => setIsMenuOpen(true)
  const closeSideMenu = () => setIsMenuOpen(false)
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
        <div className="flex justify-between items-center mb-6 gap-x-6">
          <h1 className="text-3xl font-bold">Gacha Dashboard</h1>
          <Button
            className="bg-primary text-background hover:bg-accent"
            onClick={openSideMenu}
          >
            Create New Profile
          </Button>
        </div>

        {!isLoading ? (
          <div className="flex flex-wrap gap-4 justify-start">
            {data && data.gameProfiles.length > 0 ? (
              data.gameProfiles.map((profile) => {
                const isEditing = editModeProfileId === profile.id

                return (
                  <div key={profile.id} className="w-full md:w-72">
                    {isEditing ? (
                      <ProfileEditForm
                        profile={{
                          ...profile,
                          createdAt: new Date(profile.createdAt),
                        }}
                        setEditModeProfileId={setEditModeProfileId}
                      />
                    ) : (
                      <Link href={`/game-profile/${profile.id}`}>
                        <Card className="flex flex-col p-4 bg-background border border-secondary rounded-lg hover:ring-2 hover:ring-accent transition-all duration-200 max-h-72 overflow-auto transform hover:scale-105 hover:shadow-2xl">
                          <UserRoundPen
                            className="flex flex-row self-end min-h-4 min-w-4"
                            onClick={(e) => {
                              e.preventDefault()
                              handleEditClick(profile.id)
                            }}
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
                            <p className="text-secondary">
                              Region: {profile.region}
                            </p>
                          </CardContent>
                          <CardFooter className="mt-4 text-sm text-secondary text-center flex justify-center items-center">
                            Created At:{" "}
                            {new Date(profile.createdAt).toLocaleDateString()}
                          </CardFooter>
                        </Card>
                      </Link>
                    )}
                  </div>
                )
              })
            ) : (
              <div className="flex justify-center items-center w-full h-64">
                <p className="text-secondary">
                  No profiles found. Create one to get started!
                </p>
              </div>
            )}
          </div>
        ) : (
          <GameProfileSkeleton count={3} />
        )}
        <CreateProfileSideMenu isOpen={isMenuOpen} closeMenu={closeSideMenu} />
      </div>
    </>
  )
}
