import { get } from '@/utils/request'
import { queryOptions } from '@tanstack/react-query'

export const itemsQuery = queryOptions({
  queryKey: ['items'],
  queryFn() {
    return get('https://qg5u2h7j555msnkinngqaw2zfm0enled.lambda-url.us-east-2.on.aws', {})
  },
})
