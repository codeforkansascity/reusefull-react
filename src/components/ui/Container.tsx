import { cn } from '@/utils/cn'
import React from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const containerVariants = tv({
  base: 'mx-auto w-full',
  variants: {
    size: {
      sm: 'max-w-3xl px-4',
      default: 'max-w-5xl px-4 sm:px-6 lg:px-8',
      lg: 'max-w-7xl px-4 sm:px-6 lg:px-8',
      xl: 'max-w-full px-4 sm:px-6 lg:px-8',
      full: 'max-w-none px-4 sm:px-6 lg:px-8',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof containerVariants> {}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(({ className, size, ...props }, ref) => (
  <div ref={ref} className={cn(containerVariants({ size, className }))} {...props} />
))
Container.displayName = 'Container'

export { Container }
