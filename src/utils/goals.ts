import { Goal } from '@/types'

export const getGoalProgressColor = (progress: number): string => {
  if (progress >= 100) return 'bg-green-500'
  if (progress >= 75) return 'bg-green-400'
  if (progress >= 50) return 'bg-yellow-400'
  if (progress >= 25) return 'bg-orange-400'
  return 'bg-red-400'
}

export const getGoalTypeColor = (type: Goal['type']): string => {
  switch (type) {
    case 'COMPANY':
      return 'bg-purple-100 text-purple-800'
    case 'DEPARTMENT':
      return 'bg-blue-100 text-blue-800'
    case 'TEAM':
      return 'bg-green-100 text-green-800'
    case 'PERSONAL':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export const isGoalOverdue = (deadline: Date | null | undefined): boolean => {
  if (!deadline) return false
  return new Date(deadline) < new Date()
}

export const getGoalHierarchy = (goals: Goal[]): Goal[] => {
  const goalMap = new Map<string, Goal & { children: Goal[] }>()
  const rootGoals: Goal[] = []

  // First pass: create map with children arrays
  goals.forEach(goal => {
    goalMap.set(goal.id, { ...goal, children: [] })
  })

  // Second pass: build hierarchy
  goals.forEach(goal => {
    const goalWithChildren = goalMap.get(goal.id)!
    if (goal.parentGoalId) {
      const parent = goalMap.get(goal.parentGoalId)
      if (parent) {
        parent.children.push(goalWithChildren)
      }
    } else {
      rootGoals.push(goalWithChildren)
    }
  })

  return rootGoals
}

export const calculateGoalProgress = (goal: Goal, subGoals: Goal[]): number => {
  if (subGoals.length === 0) return goal.progress
  
  const subGoalProgress = subGoals.reduce((sum, subGoal) => sum + subGoal.progress, 0)
  const averageSubGoalProgress = subGoalProgress / subGoals.length
  
  // Weight the main goal progress and sub-goal progress
  return Math.round((goal.progress * 0.3) + (averageSubGoalProgress * 0.7))
}

export const getGoalsByType = (goals: Goal[], type: Goal['type']): Goal[] => {
  return goals.filter(goal => goal.type === type)
}

export const getOverdueGoals = (goals: Goal[]): Goal[] => {
  return goals.filter(goal => isGoalOverdue(goal.deadline) && goal.progress < 100)
}

export const getUpcomingGoals = (goals: Goal[], days: number = 30): Goal[] => {
  const now = new Date()
  const futureDate = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000))
  
  return goals.filter(goal => {
    if (!goal.deadline) return false
    const deadline = new Date(goal.deadline)
    return deadline >= now && deadline <= futureDate && goal.progress < 100
  })
}
