import * as React from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '@/utils/cn'

const cardVariants = tv({
  base: ['rounded-lg border bg-card text-card-foreground shadow-sm flex flex-col gap-4', 'transition-smooth'],
  variants: {
    padding: {
      none: '',
      sm: 'p-3',
      default: 'p-6',
      lg: 'p-8',
      xl: 'p-10',
    },
    shadow: {
      none: 'shadow-none',
      sm: 'shadow-sm',
      default: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl',
    },
    variant: {
      default: '',
      elevated: 'shadow-lg border-0 bg-gradient-to-br from-card to-card/80',
      outline: 'border-2 bg-transparent',
      ghost: 'border-0 bg-transparent shadow-none',
    },
  },
  defaultVariants: {
    padding: 'default',
    shadow: 'default',
    variant: 'default',
  },
})

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>>(
  ({ className, padding, shadow, variant, ...props }, ref) => (
    <div ref={ref} className={cardVariants({ padding, shadow, variant, className })} {...props} />
  )
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col space-y-1.5', className)} {...props} />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn('text-2xl font-semibold leading-none tracking-tight', className)} {...props} />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
)
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col gap-2', className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center pt-6', className)} {...props} />
))
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
