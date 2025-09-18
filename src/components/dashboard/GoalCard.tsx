'use client'

import { Goal } from '@/types'
import { Target, Calendar, AlertCircle } from 'lucide-react'
import { getGoalProgressColor, getGoalTypeColor, isGoalOverdue } from '@/utils/goals'

interface GoalCardProps {
  goal: Goal
}

export default function GoalCard({ goal }: GoalCardProps) {
  const progressColor = getGoalProgressColor(goal.progress)
  const typeColor = getGoalTypeColor(goal.type)
  const overdue = goal.deadline ? isGoalOverdue(goal.deadline) : false

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
          {goal.title}
        </h4>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColor} ml-2 flex-shrink-0`}>
          {goal.type}
        </span>
      </div>
      
      {goal.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {goal.description}
        </p>
      )}
      
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs text-gray-600 dark:text-gray-400">
          <span>Progress</span>
          <span className="font-medium">{goal.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${progressColor}`}
            style={{ width: `${goal.progress}%` }}
          />
        </div>
      </div>
      
      {/* Deadline */}
      {goal.deadline && (
        <div className={`flex items-center space-x-1 text-xs ${
          overdue ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
        }`}>
          <Calendar className="w-3 h-3" />
          <span>
            Due {new Date(goal.deadline).toLocaleDateString()}
          </span>
          {overdue && <AlertCircle className="w-3 h-3" />}
        </div>
      )}
    </div>
  )
}
