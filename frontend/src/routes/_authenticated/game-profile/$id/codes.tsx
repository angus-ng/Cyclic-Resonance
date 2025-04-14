import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { SubNav } from "."
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createRedemptionCode,
  deleteRedemptionCode,
  getAllRedeemedCodesOptions,
} from "@/lib/api"
import { toast } from "sonner"
import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import CodesSkeleton from "@/components/skeletons/CodesSkeleton"

export const Route = createFileRoute("/_authenticated/game-profile/$id/codes")({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const [code, setCode] = useState<string>("")
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () =>
      createRedemptionCode({
        id: parseInt(id),
        code,
      }),
    onSuccess: () => {
      toast("Code added successfully")
      queryClient.invalidateQueries(getAllRedeemedCodesOptions(parseInt(id)))
      setCode("")
    },
    onError: (err: any) => {
      toast("Error", {
        description: err.message || "Failed to add code",
      })
    },
  })

  const handleCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value)
  }

  const addCode = () => {
    if (code.trim().length < 1) {
      toast("Invalid Code", {
        description: `Invalid code: "${code}"`,
      })
      return
    }

    mutation.mutate()
  }
  const deleteMutation = useMutation({
    mutationFn: (codeId: number) =>
      deleteRedemptionCode({
        id: parseInt(id),
        codeId,
      }),
    onSuccess: () => {
      toast("Code deleted")
      queryClient.invalidateQueries(getAllRedeemedCodesOptions(parseInt(id)))
    },
    onError: (err: any) => {
      toast("Error", {
        description: err.message || "Failed to delete code",
      })
    },
  })

  const { isLoading, error, data } = useQuery(
    getAllRedeemedCodesOptions(parseInt(id))
  )

  if (error) return "An error has occurred: " + error.message

  return (
    <>
      <SubNav id={id} />
      <div className="min-h-full bg-background text-text p-6 flex flex-col">
        <div className="flex mb-6 gap-x-6">
          <div className="self-start">
            <h1 className="text-3xl font-bold">Redeemed Codes</h1>
          </div>
          <div className="flex flex-grow gap-2 items-center justify-end">
            <label htmlFor="code" className="text-lg font-semibold text-text">
              Code:
            </label>
            <input
              type="text"
              placeholder="e.g. GENSHINGIFT"
              className="p-2 border border-gray-300 rounded-md bg-background text-text focus:ring-2 focus:ring-accent"
              value={code}
              onChange={handleCodeChange}
            />
            <Button
              className="bg-primary text-background hover:bg-accent"
              onClick={addCode}
            >
              Add Code
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {!isLoading && data ? (
            data.codes.map((codeObj: any) => (
              <Card
                key={codeObj.id}
                className="bg-background rounded-lg shadow-lg flex flex-col justify-between hover:ring-2 hover:ring-accent transition-all duration-200 transform hover:scale-105"
              >
                <CardHeader>
                  <h2 className="text-xl font-semibold text-text">
                    {codeObj.code}
                  </h2>
                </CardHeader>

                <CardContent>
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>
                      Redeemed{" "}
                      {formatDistanceToNow(new Date(codeObj.redeemedAt))} ago
                    </span>
                    <button
                      onClick={() => deleteMutation.mutate(codeObj.id)}
                      className="text-accent font-semibold text-xs hover:underline transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <CodesSkeleton count={4}></CodesSkeleton>
          )}
        </div>
      </div>
    </>
  )
}
