'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Plus, CheckSquare, Clock, AlertCircle, Filter } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import CreateTaskModal from '@/components/tasks/CreateTaskModal'
import Navigation from '@/components/Navigation'
import { Task } from '@/types'
import { getPriorityColor, getStatusColor, isTaskOverdue, sortTasksByPriority } from '@/utils/tasks'

export default function TasksPage() {
  const { data: session } = useSession()
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      // Mock data for demo
      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Update project documentation',
          description: 'Update API documentation for new features',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          title: 'Review code changes',
          description: 'Review pull requests from team members',
          status: 'NOT_STARTED',
          priority: 'MEDIUM',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '3',
          title: 'Prepare meeting agenda',
          description: 'Create agenda for weekly team meeting',
          status: 'COMPLETED',
          priority: 'LOW',
          dueDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '4',
          title: 'Fix critical bug',
          description: 'Resolve authentication issue in production',
          status: 'NOT_STARTED',
          priority: 'URGENT',
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
      setTasks(mockTasks)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status, updatedAt: new Date() } : task
    ))
  }

  const handleTaskCreated = (newTask: Task) => {
    setTasks(prevTasks => [newTask, ...prevTasks])
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return task.status !== 'COMPLETED'
    if (filter === 'completed') return task.status === 'COMPLETED'
    return true
  })

  const sortedTasks = sortTasksByPriority(filteredTasks)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 lg:ml-64">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Tasks
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Manage your tasks and track progress
              </p>
            </div>
            <Button 
              className="flex items-center space-x-2"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Stats and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Tasks
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {tasks.length}
                  </p>
                </div>
                <CheckSquare className="w-8 h-8 text-primary-600" />
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Pending
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {tasks.filter(t => t.status !== 'COMPLETED').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Completed
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {tasks.filter(t => t.status === 'COMPLETED').length}
                  </p>
                </div>
                <CheckSquare className="w-8 h-8 text-green-600" />
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Overdue
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {tasks.filter(t => isTaskOverdue(t.dueDate) && t.status !== 'COMPLETED').length}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </Card>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 mb-6">
            <Button
              variant={filter === 'all' ? 'primary' : 'ghost'}
              onClick={() => setFilter('all')}
            >
              All Tasks
            </Button>
            <Button
              variant={filter === 'pending' ? 'primary' : 'ghost'}
              onClick={() => setFilter('pending')}
            >
              Pending
            </Button>
            <Button
              variant={filter === 'completed' ? 'primary' : 'ghost'}
              onClick={() => setFilter('completed')}
            >
              Completed
            </Button>
          </div>

          {/* Tasks List */}
          <div className="space-y-4">
            {sortedTasks.map((task) => (
              <Card key={task.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <button
                    onClick={() => updateTaskStatus(task.id, task.status === 'COMPLETED' ? 'NOT_STARTED' : 'COMPLETED')}
                    className={`w-5 h-5 border-2 rounded flex items-center justify-center mt-1 ${
                      task.status === 'COMPLETED' 
                        ? 'border-green-500 bg-green-500' 
                        : 'border-gray-300 hover:border-primary-500'
                    }`}
                  >
                    {task.status === 'COMPLETED' && <CheckSquare className="w-3 h-3 text-white" />}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className={`text-lg font-semibold ${
                        task.status === 'COMPLETED' 
                          ? 'line-through text-gray-500' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {task.title}
                      </h3>
                      <div className="flex items-center space-x-2 ml-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    
                    {task.description && (
                      <p className="text-gray-600 dark:text-gray-400 mt-2">
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                      {task.dueDate && (
                        <div className={`flex items-center space-x-1 ${
                          isTaskOverdue(task.dueDate) ? 'text-red-500' : ''
                        }`}>
                          <Clock className="w-4 h-4" />
                          <span>
                            Due {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                          {isTaskOverdue(task.dueDate) && <AlertCircle className="w-4 h-4" />}
                        </div>
                      )}
                      {task.effort && (
                        <span>{task.effort}h estimated</span>
                      )}
                      <span>
                        Created {new Date(task.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            
            {sortedTasks.length === 0 && (
              <Card className="p-12 text-center">
                <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No tasks found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {filter === 'all' 
                    ? 'Get started by creating your first task.'
                    : `No ${filter} tasks at the moment.`
                  }
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTaskCreated={handleTaskCreated}
      />
    </div>
    </>
  )
}
