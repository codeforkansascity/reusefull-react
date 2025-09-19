import * as React from 'react'
import { Check } from 'lucide-react'
import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '@/utils/cn'

const checkboxVariants = tv({
  base: [
    'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'transition-smooth',
  ],
  variants: {
    variant: {
      default: 'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
      outline: 'data-[state=checked]:bg-transparent data-[state=checked]:border-primary data-[state=checked]:text-primary',
    },
    size: {
      sm: 'h-3 w-3',
      default: 'h-4 w-4',
      lg: 'h-5 w-5',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>, VariantProps<typeof checkboxVariants> {
  label?: string
  description?: string
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({ className, variant, size, label, description, ...props }, ref) => {
  return (
    <div className="flex items-start space-x-3">
      <div className="relative">
        <input type="checkbox" className={cn(checkboxVariants({ variant, size }), 'sr-only')} ref={ref} {...props} />
        <div
          className={cn(
            checkboxVariants({ variant, size }),
            'flex items-center justify-center',
            props.checked && 'bg-primary text-primary-foreground'
          )}
        >
          {props.checked && <Check className="h-3 w-3" />}
        </div>
      </div>
      {(label || description) && (
        <div className="flex flex-col space-y-1">
          {label && (
            <label
              htmlFor={props.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {label}
            </label>
          )}
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      )}
    </div>
  )
})
Checkbox.displayName = 'Checkbox'

export { Checkbox }
