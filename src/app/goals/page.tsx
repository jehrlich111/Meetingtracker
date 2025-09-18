'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Plus, Target, Calendar, AlertCircle, TrendingUp, Edit, BarChart3 } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Navigation from '@/components/Navigation'
import { Goal } from '@/types'
import { getGoalProgressColor, getGoalTypeColor, isGoalOverdue, getUpcomingGoals } from '@/utils/goals'
import EditGoalModal from '@/components/goals/EditGoalModal'
import UpdateProgressModal from '@/components/goals/UpdateProgressModal'

export default function GoalsPage() {
  const { data: session } = useSession()
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [updatingProgressGoal, setUpdatingProgressGoal] = useState<Goal | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showProgressModal, setShowProgressModal] = useState(false)

  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    try {
      // Mock data for demo
      const mockGoals: Goal[] = [
        {
          id: '1',
          title: 'Increase team productivity by 25%',
          description: 'Implement new processes and tools to improve team efficiency',
          type: 'TEAM',
          progress: 60,
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          ownerId: 'user1',
          orgId: 'org1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          title: 'Complete Q1 product launch',
          description: 'Launch the new product features by end of Q1',
          type: 'COMPANY',
          progress: 80,
          deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          ownerId: 'user1',
          orgId: 'org1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '3',
          title: 'Improve customer satisfaction score',
          description: 'Achieve 90%+ customer satisfaction rating',
          type: 'DEPARTMENT',
          progress: 45,
          deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
          ownerId: 'user1',
          orgId: 'org1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '4',
          title: 'Learn new technology stack',
          description: 'Master React, TypeScript, and Node.js',
          type: 'PERSONAL',
          progress: 75,
          deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          ownerId: 'user1',
          orgId: 'org1',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
      setGoals(mockGoals)
    } catch (error) {
      console.error('Error fetching goals:', error)
    } finally {
      setLoading(false)
    }
  }

  const upcomingGoals = getUpcomingGoals(goals, 30)
  const overdueGoals = goals.filter(goal => isGoalOverdue(goal.deadline) && goal.progress < 100)

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal)
    setShowEditModal(true)
  }

  const handleUpdateProgress = (goal: Goal) => {
    setUpdatingProgressGoal(goal)
    setShowProgressModal(true)
  }

  const handleGoalUpdated = (updatedGoal: Goal) => {
    setGoals(goals.map(goal => goal.id === updatedGoal.id ? updatedGoal : goal))
  }

  const handleProgressUpdated = (goalId: string, newProgress: number) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, progress: newProgress, updatedAt: new Date() }
        : goal
    ))
  }

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
                Goals
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Track your progress and achieve your objectives
              </p>
            </div>
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Goal</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Goals
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {goals.length}
                  </p>
                </div>
                <Target className="w-8 h-8 text-primary-600" />
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Completed
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {goals.filter(g => g.progress === 100).length}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    In Progress
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {goals.filter(g => g.progress > 0 && g.progress < 100).length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Overdue
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {overdueGoals.length}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </Card>
          </div>

          {/* Goals List */}
          <div className="space-y-6">
            {goals.map((goal) => (
              <Card key={goal.id} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {goal.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGoalTypeColor(goal.type)}`}>
                        {goal.type}
                      </span>
                    </div>
                    
                    {goal.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {goal.description}
                      </p>
                    )}

                    {/* Progress Bar */}
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                        <span>Progress</span>
                        <span className="font-medium">{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getGoalProgressColor(goal.progress)}`}
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-4">
                        {goal.deadline && (
                          <div className={`flex items-center space-x-1 ${
                            isGoalOverdue(goal.deadline) ? 'text-red-500' : ''
                          }`}>
                            <Calendar className="w-4 h-4" />
                            <span>
                              Due {new Date(goal.deadline).toLocaleDateString()}
                            </span>
                            {isGoalOverdue(goal.deadline) && <AlertCircle className="w-4 h-4" />}
                          </div>
                        )}
                        <span>
                          Created {new Date(goal.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditGoal(goal)}
                      className="flex items-center space-x-1"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleUpdateProgress(goal)}
                      className="flex items-center space-x-1"
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span>Update Progress</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            
            {goals.length === 0 && (
              <Card className="p-12 text-center">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No goals yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Get started by creating your first goal.
                </p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Goal
                </Button>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Edit Goal Modal */}
      <EditGoalModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setEditingGoal(null)
        }}
        onGoalUpdated={handleGoalUpdated}
        goal={editingGoal}
      />

      {/* Update Progress Modal */}
      <UpdateProgressModal
        isOpen={showProgressModal}
        onClose={() => {
          setShowProgressModal(false)
          setUpdatingProgressGoal(null)
        }}
        onProgressUpdated={handleProgressUpdated}
        goal={updatingProgressGoal}
      />
    </div>
    </>
  )
}
