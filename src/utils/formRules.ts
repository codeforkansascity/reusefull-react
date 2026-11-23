// react-hook-form rule: a non-empty value after trimming, with a visible message.
// (A plain `required: true` accepts a field containing only spaces.)
export const requiredText = (label: string) => ({
  validate: (value?: string) => (value ?? '').trim().length > 0 || `${label} is required`,
})
