import { Card, CardContent, CardHeader } from "../ui/card"
import { Skeleton } from "../ui/skeleton"
import { Button } from "../ui/button"

const CodesSkeleton = ({ count }: { count: number }) => {
  return (
    <div className="flex flex-wrap gap-4 justify-start w-full">
      {Array.from({ length: count }).map((_, index) => (
        <Card
          key={index}
          className="w-full max-w-xs bg-background rounded-lg shadow-lg flex flex-col justify-start hover:ring-2 hover:ring-accent transition-all duration-200 transform hover:scale-105 hover:shadow-2xl"
        >
          <CardHeader className="flex items-center justify-between">
            <Skeleton className="w-32 h-6 bg-primary animate-pulse" />
            <Button
              variant="destructive"
              size="sm"
              disabled
              className="h-6 w-14 animate-pulse"
            />
          </CardHeader>

          <CardContent>
            <div className="text-xs text-gray-500">
              <Skeleton className="w-24 h-4 bg-gray-600 animate-pulse" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default CodesSkeleton
