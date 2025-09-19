import * as React from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const headlineVariants = tv({
  base: ['font-semibold leading-tight tracking-tight text-foreground', 'transition-smooth'],
  variants: {
    size: {
      xs: 'text-lg',
      sm: 'text-xl',
      default: 'text-2xl',
      lg: 'text-3xl',
      xl: 'text-4xl',
      '2xl': 'text-5xl',
      '3xl': 'text-6xl',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold',
    },
    variant: {
      default: '',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      gradient: 'gradient-text',
      reusefull: 'reusefull-gradient',
    },
  },
  defaultVariants: {
    size: 'default',
    weight: 'semibold',
    variant: 'default',
  },
})

export interface HeadlineProps extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof headlineVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}

const Headline = React.forwardRef<HTMLHeadingElement, HeadlineProps>(({ className, size, weight, variant, as = 'h3', ...props }, ref) => {
  // Size mapping for semantic elements
  const sizeMap: Record<NonNullable<HeadlineProps['as']>, keyof typeof headlineVariants.variants.size> = {
    h1: '3xl',
    h2: '2xl',
    h3: 'xl',
    h4: 'lg',
    h5: 'default',
    h6: 'sm',
  }

  // Override size if as prop is provided and no explicit size
  const finalSize = size || (as ? sizeMap[as] : 'default')

  return React.createElement(as, {
    ref,
    className: headlineVariants({ size: finalSize, weight, variant, className }),
    ...props,
  })
})
Headline.displayName = 'Headline'

export { Headline }
