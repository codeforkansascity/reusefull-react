import { get } from '@/utils/request'
import { queryOptions } from '@tanstack/react-query'

export const orgItemsQuery = queryOptions({
  queryKey: ['orgItems'],
  queryFn() {
    return get('https://4nekwiwkkyz4uwidxgxuykksmq0xvuez.lambda-url.us-east-2.on.aws', {})
  },
  staleTime: 1000 * 60 * 60 * 2, // 2 hours
  gcTime: 1000 * 60 * 60 * 3, // 3 hours (how long to keep in cache after unused)
})
