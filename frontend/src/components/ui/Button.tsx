import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/utils/format'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, disabled, className, children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-tcnr01-full transition-all duration-tcnr01 relative overflow-hidden'

    const variants = {
      primary: 'bg-tcnr01-black text-white hover:bg-tcnr01-gray-600 disabled:bg-tcnr01-gray-100 disabled:text-tcnr01-gray-300',
      secondary:
        'bg-white text-tcnr01-black border border-tcnr01-gray-200 hover:border-tcnr01-black disabled:border-tcnr01-gray-100 disabled:text-tcnr01-gray-300',
      text: 'bg-transparent text-tcnr01-black hover:text-tcnr01-gray-300 underline underline-offset-4',
    }

    const sizes = {
      sm: 'h-10 px-4 text-tcnr01-sm',
      md: 'h-12 px-5 text-tcnr01-base',
      lg: 'h-14 px-6 text-tcnr01-base',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            載入中...
          </span>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
