import { Loader2 } from 'lucide-react'
import { Text } from './Text'

interface LoadingSpinnerProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ message = 'Loading...', size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin text-primary`} />
      <Text size="lg" variant="muted">
        {message}
      </Text>
    </div>
  )
}
