import { useState } from 'react'
import { cn } from '@/utils/format'

interface ProductDescriptionProps {
  description: string
}

export function ProductDescription({ description }: ProductDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const paragraphs = description.split('\n\n').filter(Boolean)

  return (
    <div className="border-t border-tcnr01-gray-100 pt-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="text-tcnr01-lg font-medium">商品說明</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={cn(
            'transition-transform duration-200',
            isExpanded && 'rotate-180'
          )}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <div
        className={cn(
          'overflow-hidden transition-all duration-300',
          isExpanded ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0'
        )}
      >
        <div className="space-y-4 text-tcnr01-base text-tcnr01-gray-500">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="whitespace-pre-line">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
