import * as React from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '@/utils/cn'

const checkboxVariants = tv({
  base: [
    'h-4 w-4 shrink-0 rounded-sm border-2 border-gray-300 bg-white',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'transition-all duration-200 ease-in-out',
    'appearance-none cursor-pointer',
    'checked:bg-primary checked:border-primary',
    'checked:before:content-["✓"] checked:before:absolute checked:before:top-1/2 checked:before:left-1/2 checked:before:-translate-x-1/2 checked:before:-translate-y-2/3 checked:before:text-white checked:before:font-bold checked:before:leading-none',
  ],
  variants: {
    variant: {
      default: '',
      outline: 'checked:bg-transparent checked:border-primary checked:text-primary',
    },
    size: {
      sm: 'h-4 w-4 checked:before:text-xs',
      default: 'h-4 w-4 checked:before:text-sm',
      lg: 'h-4 w-4 checked:before:text-base',
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
    <div className="flex items-start space-x-3 translate-y-0.5">
      <div className="relative">
        <input type="checkbox" className={cn(checkboxVariants({ variant, size }), className)} ref={ref} {...props} />
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
