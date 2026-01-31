import { get } from '@/utils/request'
import { queryOptions } from '@tanstack/react-query'

export const categoriesQuery = queryOptions({
  queryKey: ['categories'],
  queryFn() {
      return get('https://4zm4kqhbosmorygtjwdanxrpqe0imbml.lambda-url.us-east-2.on.aws', {}) //Charity Types
  },
  staleTime: 1000 * 60 * 60 * 2, // 2 hours
  gcTime: 1000 * 60 * 60 * 3, // 3 hours (how long to keep in cache after unused)
})
