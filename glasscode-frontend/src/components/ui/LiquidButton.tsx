import { motion } from 'framer-motion'
import { ButtonHTMLAttributes, ReactNode } from 'react'

interface LiquidButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LiquidButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: LiquidButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-primary-500 to-primary-400
      text-white
      border-none
      hover:shadow-[0_4px_20px_rgba(99,102,241,0.4),0_0_40px_rgba(99,102,241,0.2)]
    `,
    secondary: `
      bg-white/40
      backdrop-blur-xl
      text-primary-600
      border border-primary-300/30
      hover:bg-white/60
      hover:border-primary-400/50
    `,
    ghost: `
      bg-transparent
      text-primary-600
      border border-transparent
      hover:bg-primary-50/50
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-rose-500
      text-white
      border-none
      hover:shadow-[0_4px_20px_rgba(239,68,68,0.4),0_0_40px_rgba(239,68,68,0.2)]
    `,
  }

  const baseClasses = `
    relative
    overflow-hidden
    rounded-xl
    font-medium
    cursor-pointer
    transition-all
    duration-300
    select-none
  `

  return (
    <motion.button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{
        y: -2,
        scale: 1.02,
        transition: { duration: 0.2, ease: [0.68, -0.55, 0.265, 1.55] }
      }}
      whileTap={{
        scale: 0.98,
        y: 0,
        transition: { duration: 0.1 }
      }}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      <motion.span
        className="absolute inset-0 bg-white/20"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />
    </motion.button>
  )
}
