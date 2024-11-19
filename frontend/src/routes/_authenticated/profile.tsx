import { createFileRoute } from "@tanstack/react-router"
import { userQueryOptions } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/_authenticated/profile")({
  component: Profile,
})

function Profile() {
  const { isLoading, error, data } = useQuery(userQueryOptions)

  if (isLoading) return "loading"
  if (error) return "Not logged in"

  return (
    <div className="p-2">
      <div className="flex items-center gap-2">
        <Avatar>
          {data?.user.picture && (
            <AvatarImage
              src={data.user.picture}
              alt={data.user.given_name}
            ></AvatarImage>
          )}
          <AvatarFallback>{data?.user.given_name}</AvatarFallback>
        </Avatar>
        <p>
          Hello {data?.user.given_name} {data?.user.family_name}
        </p>
      </div>
      <Button asChild className="my-4 text-background">
        <a href="/api/logout">Logout</a>
      </Button>
    </div>
  )
}
