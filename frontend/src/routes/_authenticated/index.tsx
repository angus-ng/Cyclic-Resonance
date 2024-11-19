import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/_authenticated/')({
  component: Index,
})

async function getTotalSpent() {
  const res = await api.expenses['total-spent'].$get()
  if (!res.ok) {
    throw new Error('server error')
  }
  const data = await res.json()
  return data
}
function Index() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['get-total-spent'],
    queryFn: getTotalSpent,
  })

  if (isLoading) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  // const [totalSpent, setTotalSpent] = useState(0)

  // useEffect(() => {
  //   async function fetchTotal() {
  //     const res = await api.expenses["total-spent"].$get()
  //     const data = await res.json()
  //     setTotalSpent(data.total)
  //   }
  //   fetchTotal()
  // }, [])

  return (
    <Card className="w-[350px] m-auto">
      <CardHeader>
        <CardTitle>Total Spent</CardTitle>
        <CardDescription>The total amount you've spent</CardDescription>
      </CardHeader>
      <CardContent>{isLoading ? '...' : data?.total}</CardContent>
    </Card>
  )
}
