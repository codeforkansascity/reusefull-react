import * as React from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '@/utils/cn'

const checkboxVariants = tv({
  base: [
    'peer h-5 w-5 shrink-0 rounded border border-gray-300 bg-white',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'transition-all duration-200 ease-in-out',
    'appearance-none cursor-pointer relative',
    'checked:bg-[#0d6efd] checked:border-[#0d6efd]',
  ],
  variants: {
    variant: {
      default: '',
      outline: 'checked:bg-transparent checked:border-[#0d6efd] checked:text-[#0d6efd]',
    },
    size: {
      sm: 'h-4 w-4',
      default: 'h-5 w-5',
      lg: 'h-6 w-6',
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
      <label className="relative flex items-center">
        <input 
          type="checkbox" 
          className={cn(checkboxVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100">
          <svg 
            width="12" 
            height="12" 
            viewBox="0 0 12 12" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M10 3L4.5 8.5L2 6" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </label>
      {(label || description) && (
        <div className="flex flex-col space-y-1">
          <label
            htmlFor={props.id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
    </div>
  )
})

Checkbox.displayName = 'Checkbox'

export { Checkbox, checkboxVariants }
