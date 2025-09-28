import * as React from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const inputVariants = tv({
  base: [
    'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
    'placeholder:text-muted-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'transition-smooth',
  ],
  variants: {
    inputSize: {
      default: 'h-10 px-3 py-2',
      sm: 'h-8 px-2 py-1 text-xs',
      lg: 'h-12 px-4 py-3 text-base',
      xl: 'h-14 px-6 py-4 text-lg',
    },
    variant: {
      default: '',
      error: 'border-destructive focus-visible:ring-destructive',
      success: 'border-success focus-visible:ring-success',
    },
  },
  defaultVariants: {
    inputSize: 'default',
    variant: 'default',
  },
})

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & VariantProps<typeof inputVariants>

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, inputSize, variant, ...props }, ref) => {
  return <input type={type} className={inputVariants({ inputSize, variant, className })} ref={ref} {...props} />
})
Input.displayName = 'Input'

export { Input }
