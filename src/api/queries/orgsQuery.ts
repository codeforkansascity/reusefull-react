import { get } from '@/utils/request'
import { queryOptions } from '@tanstack/react-query'

export const orgsQuery = queryOptions({
  queryKey: ['orgs'],
  queryFn() {
      return get('https://4e67jwa7xlurv6riekrumne5h40ssntr.lambda-url.us-east-2.on.aws', {})
  },
  staleTime: 1000 * 60 * 60 * 2, // 2 hours
  gcTime: 1000 * 60 * 60 * 3, // 3 hours (how long to keep in cache after unused)
})
