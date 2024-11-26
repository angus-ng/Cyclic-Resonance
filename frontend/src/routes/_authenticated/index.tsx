import { createFileRoute } from "@tanstack/react-router"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { api, getAllGameProfilesOptions } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import ProfileModal from "@/components/ui/profileModal"
import { useState } from "react"

export const Route = createFileRoute("/_authenticated/")({
  component: Index,
})

async function getTotalSpent() {
  const res = await api.expenses["total-spent"].$get()
  if (!res.ok) {
    throw new Error("server error")
  }
  const data = await res.json()
  return data
}

async function getGameProfiles() {
  const res = await api["game-profiles"].$get()
  if (!res.ok) {
    throw new Error("server error")
  }
  const data = await res.json()
  return data
}

function Index() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)
  const totalSpent = useQuery({
    queryKey: ["get-total-spent"],
    queryFn: getTotalSpent,
  })

  const { isLoading, error, data } = useQuery(getAllGameProfilesOptions)
  // const { data: loadingCreateExpense } = useQuery(
  //   loadingCreateExpenseQueryOptions
  // )
  if (error) return "An error has occurred: " + error.message

  return (
    <>
      <Card className="w-[350px] m-auto">
        <CardHeader>
          <CardTitle>Total Spent</CardTitle>
          <CardDescription>The total amount you've spent</CardDescription>
        </CardHeader>
        <CardContent>
          {totalSpent.isLoading ? "..." : totalSpent.data?.total}
        </CardContent>
      </Card>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <div className="min-h-screen bg-background text-text p-6 flex flex-col">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gacha Dashboard</h1>
          <Button
            className="bg-primary text-background hover:bg-accent"
            onClick={openModal}
          >
            Create New Profile
          </Button>
        </div>

        {/* Profile Cards */}
        <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
          {data && data.gameProfiles.length > 0 ? (
            data.gameProfiles.map((profile) => (
              <Card
                key={profile.id}
                className="flex flex-col w-72 p-4 bg-background border border-secondary rounded-lg hover:ring-2 hover:ring-accent transition-all duration-200"
              >
                <CardHeader className="text-center">
                  <h2 className="text-xl font-bold text-text">
                    {profile.game}
                  </h2>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <p className="text-secondary">IGN: {profile.ign}</p>
                  <p className="text-secondary">Game UID: {profile.gameUID}</p>
                  <p className="text-secondary">Region: {profile.region}</p>
                </CardContent>
                <CardFooter className="mt-4 text-sm text-secondary text-center">
                  Created At: {new Date(profile.createdAt).toLocaleDateString()}
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="flex justify-center items-center w-full h-64">
              <p className="text-secondary">
                No profiles found. Create one to get started!
              </p>
            </div>
          )}
        </div>
        <ProfileModal isOpen={isModalOpen} closeModal={closeModal} />
      </div>
    </>
  )
}
