import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"
import { Skeleton } from "../ui/skeleton"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"

const ResourcesSkeleton = ({ count }: { count: number }) => {
  return (
    <div className="flex flex-wrap gap-4 justify-start">
      {Array.from({ length: count }).map((_, index) => (
        <Card
          key={index}
          className="w-full max-w-sm bg-background rounded-lg shadow-lg flex flex-col justify-start hover:ring-2 hover:ring-accent transition-all duration-200 transform hover:scale-105 hover:shadow-2xl"
        >
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="w-32 h-6 bg-primary animate-pulse" />
              <Badge
                className="w-20 h-6 bg-gray-500 animate-pulse"
                variant="outline"
              />
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              <div className="text-sm text-gray-400 flex items-center">
                <Skeleton className="w-16 h-4 bg-gray-600 animate-pulse" />
                <Skeleton className="w-12 h-4 bg-gray-600 ml-2 animate-pulse" />
              </div>

              <div className="text-sm text-gray-400 flex items-center">
                <Skeleton className="w-20 h-4 bg-gray-600 animate-pulse" />
              </div>

              <div className="w-full bg-background-lighter rounded-full h-2 mt-2">
                <div className="bg-primary h-2 rounded-full animate-pulse" />
              </div>

              <div className="text-xs text-gray-500">
                <Skeleton className="w-24 h-4 bg-gray-600 animate-pulse" />
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button
              variant="outline"
              className="w-full text-sm bg-primary text-background hover:bg-accent hover:text-background-lighter transition-all duration-200"
            >
              <Skeleton className="w-full h-6 bg-primary animate-pulse" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export default ResourcesSkeleton
