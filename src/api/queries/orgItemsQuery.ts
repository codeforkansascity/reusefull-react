import { get } from '@/utils/request'
import { queryOptions } from '@tanstack/react-query'

export const orgItemsQuery = queryOptions({
  queryKey: ['orgItems'],
  queryFn() {
    return get('https://4nekwiwkkyz4uwidxgxuykksmq0xvuez.lambda-url.us-east-2.on.aws', {})
  },
})
