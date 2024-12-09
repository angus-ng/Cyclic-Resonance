import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute(
  "/_authenticated/game-profile/$id/screenshots"
)({
  component: RouteComponent,
})

function RouteComponent() {
  return "Hello /_authenticated/game-profile/$id/screenshots!"
}
