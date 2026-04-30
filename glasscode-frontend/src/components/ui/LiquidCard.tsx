import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface LiquidCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  hoverable?: boolean
}

export function LiquidCard({
  children,
  className = '',
  onClick,
  hoverable = true,
}: LiquidCardProps) {
  const baseClasses = `
    rounded-3xl
    backdrop-blur-xl
    bg-white/40
    border
    border-white/50
    shadow-2xl
    ${hoverable ? 'cursor-pointer' : ''}
  `

  const hoverClasses = hoverable
    ? 'hover:translate-y-[-2px] hover:scale-[1.01] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15),0_0_40px_rgba(99,102,241,0.1)]'
    : ''

  return (
    <motion.div
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={hoverable ? {
        y: -4,
        scale: 1.02,
        transition: { duration: 0.2, ease: [0.68, -0.55, 0.265, 1.55] }
      } : undefined}
      whileTap={onClick ? {
        scale: 0.98,
        transition: { duration: 0.1 }
      } : undefined}
    >
      {children}
    </motion.div>
  )
}
