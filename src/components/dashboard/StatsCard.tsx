'use client'

import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  color: 'blue' | 'green' | 'orange' | 'purple' | 'red'
}

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400',
  green: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400',
  orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400',
  red: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400',
}

export default function StatsCard({ title, value, icon: Icon, color }: StatsCardProps) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}
