import { get } from '@/utils/request'
import { queryOptions } from '@tanstack/react-query'

export const categoriesQuery = queryOptions({
  queryKey: ['categories'],
  queryFn() {
    return get('https://72m57zkngqsdsomp6ameqd2c6u0wqflv.lambda-url.us-east-2.on.aws', {})
  },
})
