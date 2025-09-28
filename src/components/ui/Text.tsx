import * as React from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

const textVariants = tv({
  base: ['leading-relaxed text-foreground', 'transition-smooth'],
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      default: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    variant: {
      default: '',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
      secondary: 'text-secondary-foreground',
      success: 'text-success',
      warning: 'text-warning',
      destructive: 'text-destructive',
      gradient: 'gradient-text',
      reusefull: 'reusefull-gradient',
    },
    align: {
      left: '',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    },
  },
  defaultVariants: {
    size: 'default',
    weight: 'normal',
    variant: 'default',
    align: 'left',
  },
})

export interface TextProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof textVariants> {
  as?: 'p' | 'span' | 'div' | 'label' | 'small' | 'strong' | 'em' | 'code'
}

const Text = React.forwardRef<HTMLElement, TextProps>(({ className, size, weight, variant, align, as = 'p', ...props }, ref) => {
  return React.createElement(as, {
    ref,
    className: textVariants({ size, weight, variant, align, className }),
    ...props,
  })
})
Text.displayName = 'Text'

export { Text }
