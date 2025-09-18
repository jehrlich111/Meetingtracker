'use client'

import { Task } from '@/types'
import { CheckSquare, Clock, AlertCircle, User, Calendar } from 'lucide-react'
import { getPriorityColor, getStatusColor, isTaskOverdue } from '@/utils/tasks'

interface TaskCardProps {
  task: Task
}

export default function TaskCard({ task }: TaskCardProps) {
  const priorityColor = getPriorityColor(task.priority)
  const statusColor = getStatusColor(task.status)
  const overdue = task.dueDate ? isTaskOverdue(task.dueDate) : false

  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <div className="flex-shrink-0 mt-1">
        <CheckSquare className={`w-4 h-4 ${
          task.status === 'COMPLETED' 
            ? 'text-green-500' 
            : 'text-gray-400'
        }`} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <h4 className={`text-sm font-medium ${
            task.status === 'COMPLETED' 
              ? 'line-through text-gray-500 dark:text-gray-400' 
              : 'text-gray-900 dark:text-white'
          }`}>
            {task.title}
          </h4>
          <div className="flex items-center space-x-2 ml-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColor}`}>
              {task.priority}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
              {task.status.replace('_', ' ')}
            </span>
          </div>
        </div>
        
        {task.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
            {task.description}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
            {task.dueDate && (
              <div className={`flex items-center space-x-1 ${
                overdue ? 'text-red-500' : ''
              }`}>
                <Clock className="w-3 h-3" />
                <span>
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
                {overdue && <AlertCircle className="w-3 h-3" />}
              </div>
            )}
            {task.effort && (
              <span>{task.effort}h estimated</span>
            )}
          </div>
        </div>

        {/* Assignment Info */}
        {(task.assignedToUser || task.assignedToUserId || task.meetingId) && (
          <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
            {task.assignedToUser && (
              <div className="flex items-center space-x-1">
                <User className="w-3 h-3" />
                <span>Assigned to {task.assignedToUser.name || task.assignedToUser.email}</span>
              </div>
            )}
            {task.meetingId && (
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>Linked to meeting</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
