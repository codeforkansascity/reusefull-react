import { get } from '@/utils/request'
import { queryOptions } from '@tanstack/react-query'

export const itemsQuery = queryOptions({
  queryKey: ['items'],
  queryFn() {
      return get('https://kudlj6hfqxkm327mdrzrmx6rri0gvomt.lambda-url.us-east-2.on.aws', {})
  },
  staleTime: 1000 * 60 * 60 * 2, // 2 hours
  gcTime: 1000 * 60 * 60 * 3, // 3 hours (how long to keep in cache after unused)
})
