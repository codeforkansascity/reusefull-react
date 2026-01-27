import { get } from '@/utils/request'
import { queryOptions } from '@tanstack/react-query'

export const orgCharityTypesQuery = queryOptions({
  queryKey: ['orgCharityTypes'],
  queryFn() {
    return get('https://ea72ghbgvxuwvy37ixyeztt5mu0uvtcm.lambda-url.us-east-2.on.aws', {})
  },
})
