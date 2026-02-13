import { useEffect, type ReactNode } from 'react'
import { cn } from '@/utils/format'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string
}

export function Modal({ isOpen, onClose, children, className }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleEsc)
    }

    return () => {
      window.removeEventListener('keydown', handleEsc)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 animate-tcnr01-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          'relative bg-white rounded-tcnr01-lg shadow-tcnr01-xl max-h-[90vh] overflow-auto animate-tcnr01-fade-in',
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}
