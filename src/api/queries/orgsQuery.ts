import { get } from '@/utils/request'
import { queryOptions } from '@tanstack/react-query'

export const orgsQuery = queryOptions({
  queryKey: ['orgs'],
  queryFn() {
    return get('https://lrx3rtyjpiibqojpa47q2ppace0oxvlm.lambda-url.us-east-2.on.aws', {})
  },
})
