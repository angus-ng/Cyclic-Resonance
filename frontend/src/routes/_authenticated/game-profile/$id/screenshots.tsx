import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { SubNav } from "."
import { toast } from "sonner"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute(
  "/_authenticated/game-profile/$id/screenshots"
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([])

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      setSelectedFiles(Array.from(files))
    }
  }

  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files) {
      setSelectedFiles(Array.from(files))
    }
  }

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      toast("No files selected", {
        description: "Please select or drop files to upload.",
      })
      return
    }
    toast("Uploading...", {
      description: "Simulating file upload...",
    })

    toast("Upload Successful", {
      description: "Your screenshots were uploaded successfully.",
    })
    setSelectedFiles([])
  }

  return (
    <>
      <SubNav id={id} />
      <div className="min-h-full bg-background text-text p-6 flex flex-col">
        <div className="flex justify-between items-center mb-6 gap-x-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Upload Screenshots</h1>
          </div>
        </div>

        <Card className="flex flex-col max-w-lg mx-auto bg-background border border-secondary rounded-lg shadow-lg">
          <CardHeader>
            <h2 className="text-xl font-semibold text-text">
              Drag and Drop or Click to Upload
            </h2>
          </CardHeader>
          <CardContent>
            <div
              className="w-full h-48 bg-background-lighter border-dashed border-2 border-gray-300 rounded-lg flex justify-center items-center text-center cursor-pointer hover:bg-background-200 transition-all"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                multiple
                onChange={handleFileSelect}
              />
              <div>
                <p className="text-gray-500">
                  Drag & Drop your screenshots here
                </p>
                <p className="text-gray-400">or</p>
                <Button className="text-black hover:bg-accent">
                  Click to Select Files
                </Button>
              </div>
            </div>
            <div className="mt-4">
              {selectedFiles.length > 0 && (
                <ul className="list-disc pl-5 text-sm text-text">
                  {selectedFiles.map((file, index) => (
                    <li key={index} className="text-accent">
                      {file.name} ({(file.size / 1024).toFixed(2)} KB)
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-primary text-background hover:bg-accent"
              onClick={handleUpload}
              disabled={selectedFiles.length === 0}
            >
              Upload Screenshots
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  )
}
