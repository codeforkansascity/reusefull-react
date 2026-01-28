import { get } from '@/utils/request'
import { queryOptions } from '@tanstack/react-query'

export const categoriesQuery = queryOptions({
  queryKey: ['categories'],
  queryFn() {
      return get('https://4zm4kqhbosmorygtjwdanxrpqe0imbml.lambda-url.us-east-2.on.aws', {})
  },
})
