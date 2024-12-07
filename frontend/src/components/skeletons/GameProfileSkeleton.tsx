import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"
import { Skeleton } from "../ui/skeleton"

const GameProfileSkeleton = ({ count }: { count: number }) => {
  return (
    <div className="flex flex-wrap gap-4 justify-start">
      {Array.from({ length: count }).map((_, index) => (
        <Card
          key={index}
          className="flex flex-col w-72 p-4 bg-background border border-secondary rounded-lg hover:ring-2 hover:ring-accent transition-all duration-200 max-h-72 overflow-auto"
        >
          <div className="flex flex-row self-end min-h-4 min-w-4">
            <Skeleton className="w-4 h-4 bg-primary animate-pulse" />
          </div>

          <CardHeader className="flex flex-row justify-center items-center text-center w-full">
            <Skeleton className="w-24 h-6 bg-primary animate-pulse" />
          </CardHeader>

          <CardContent className="flex flex-col items-center">
            <Skeleton className="w-44 h-5 mb-2 bg-gray-600 animate-pulse" />
            <Skeleton className="w-44 h-5 mb-2 bg-gray-600 animate-pulse" />
            <Skeleton className="w-44 h-5 mb-2 bg-gray-600 animate-pulse" />
          </CardContent>

          <CardFooter className="mt-4 text-sm text-secondary text-center flex justify-center items-center">
            <Skeleton className="w-36 h-4 bg-gray-600 animate-pulse" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export default GameProfileSkeleton
