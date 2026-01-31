import { get } from '@/utils/request'
import { queryOptions } from '@tanstack/react-query'

export const orgCharityTypesQuery = queryOptions({
  queryKey: ['orgCharityTypes'],
  queryFn() {
      return get('https://o6zpi54q3u247x73qsckjxesay0ibtke.lambda-url.us-east-2.on.aws/', {})  //Org Types
  },
  staleTime: 1000 * 60 * 60 * 2, // 2 hours
  gcTime: 1000 * 60 * 60 * 3, // 3 hours (how long to keep in cache after unused)
})
