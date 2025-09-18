import { Task, Priority } from '@/types'

export const getPriorityColor = (priority: Priority): string => {
  switch (priority) {
    case 'LOW':
      return 'bg-gray-100 text-gray-800'
    case 'MEDIUM':
      return 'bg-blue-100 text-blue-800'
    case 'HIGH':
      return 'bg-orange-100 text-orange-800'
    case 'URGENT':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export const getStatusColor = (status: Task['status']): string => {
  switch (status) {
    case 'NOT_STARTED':
      return 'bg-gray-100 text-gray-800'
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-800'
    case 'COMPLETED':
      return 'bg-green-100 text-green-800'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export const isTaskOverdue = (dueDate: Date | null | undefined): boolean => {
  if (!dueDate) return false
  return new Date(dueDate) < new Date()
}

export const getTaskProgress = (tasks: Task[]): number => {
  if (tasks.length === 0) return 0
  const completedTasks = tasks.filter(task => task.status === 'COMPLETED').length
  return Math.round((completedTasks / tasks.length) * 100)
}

export const getTasksByStatus = (tasks: Task[], status: Task['status']): Task[] => {
  return tasks.filter(task => task.status === status)
}

export const sortTasksByPriority = (tasks: Task[]): Task[] => {
  const priorityOrder = { 'URGENT': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 }
  return tasks.sort((a, b) => {
    const aPriority = priorityOrder[a.priority] || 0
    const bPriority = priorityOrder[b.priority] || 0
    return bPriority - aPriority
  })
}

export const getUpcomingTasks = (tasks: Task[], days: number = 7): Task[] => {
  const now = new Date()
  const futureDate = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000))
  
  return tasks.filter(task => {
    if (!task.dueDate) return false
    const dueDate = new Date(task.dueDate)
    return dueDate >= now && dueDate <= futureDate && task.status !== 'COMPLETED'
  })
}
