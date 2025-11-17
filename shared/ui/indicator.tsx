import * as React from 'react'
import { cn } from '@/shared/lib'

type SkillIndicatorColor = 'red' | 'orange' | 'green' | 'blue' | 'gray'

const colorClasses: Record<SkillIndicatorColor, string> = {
  red: 'bg-red-500',
  orange: 'bg-orange-400',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  gray: 'bg-gray-500',
}

const transparentColorClasses: Record<SkillIndicatorColor, string> = {
  red: 'bg-red-500/20',
  orange: 'bg-orange-400/20',
  green: 'bg-green-500/20',
  blue: 'bg-blue-500/20',
  gray: 'bg-gray-500/20',
}

function getColorFromValue(value: number): SkillIndicatorColor {
  if (value >= 9) return 'red'
  if (value >= 7) return 'orange'
  if (value >= 5) return 'green'
  if (value >= 3) return 'blue'
  return 'gray'
}

function getWidthPercentage(value: number): number {
  return Math.min(100, Math.max(0, (value / 10) * 100))
}

export interface SkillIndicatorProps {
  label: string
  value: number
  className?: string
}

export function SkillIndicator({ label, value, className }: SkillIndicatorProps) {
  const color = getColorFromValue(value)
  const widthPercentage = getWidthPercentage(value)

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className={cn('h-0.5 w-16 flex-shrink-0 relative overflow-hidden', transparentColorClasses[color])}>
        <span
          className={cn('absolute left-0 top-0 h-full', colorClasses[color])}
          style={{ width: `${widthPercentage}%` }}
        />
      </div>
      <span className="text-gray-300">{label}</span>
    </div>
  )
}

