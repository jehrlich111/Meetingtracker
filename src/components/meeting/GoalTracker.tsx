'use client'

import { useState, useEffect } from 'react'
import { Target, TrendingUp, Calendar, AlertCircle, CheckCircle } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Goal } from '@/types'
import { getGoalProgressColor, getGoalTypeColor, isGoalOverdue } from '@/utils/goals'

interface GoalTrackerProps {
  meetingId: string
  onGoalUpdate: (goalId: string, progress: number) => void
}

export default function GoalTracker({ meetingId, onGoalUpdate }: GoalTrackerProps) {
  const [goals, setGoals] = useState<Goal[]>([])
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [progressUpdate, setProgressUpdate] = useState(0)

  useEffect(() => {
    fetchGoals()
  }, [meetingId])

  const fetchGoals = async () => {
    // Mock goals data
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
      }
    ]
    setGoals(mockGoals)
  }

  const updateGoalProgress = (goalId: string, newProgress: number) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, progress: Math.min(100, Math.max(0, newProgress)), updatedAt: new Date() }
        : goal
    ))
    onGoalUpdate(goalId, newProgress)
  }

  const handleProgressUpdate = () => {
    if (selectedGoal && progressUpdate !== selectedGoal.progress) {
      updateGoalProgress(selectedGoal.id, progressUpdate)
      setSelectedGoal(null)
      setProgressUpdate(0)
    }
  }

  const getProgressStatus = (goal: Goal) => {
    if (goal.progress === 100) return 'completed'
    if (isGoalOverdue(goal.deadline)) return 'overdue'
    if (goal.progress >= 75) return 'on-track'
    if (goal.progress >= 50) return 'in-progress'
    return 'behind'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600'
      case 'on-track': return 'text-blue-600'
      case 'in-progress': return 'text-yellow-600'
      case 'behind': return 'text-orange-600'
      case 'overdue': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'overdue': return <AlertCircle className="w-4 h-4" />
      default: return <TrendingUp className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Goals Overview */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2" />
          Meeting Goals & Progress
        </h3>
        
        <div className="space-y-4">
          {goals.map((goal) => {
            const status = getProgressStatus(goal)
            return (
              <div key={goal.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900 dark:text-white">{goal.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGoalTypeColor(goal.type)}`}>
                        {goal.type}
                      </span>
                      <span className={`flex items-center space-x-1 text-xs ${getStatusColor(status)}`}>
                        {getStatusIcon(status)}
                        <span className="capitalize">{status.replace('-', ' ')}</span>
                      </span>
                    </div>
                    {goal.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {goal.description}
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setSelectedGoal(goal)
                      setProgressUpdate(goal.progress)
                    }}
                  >
                    Update
                  </Button>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
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

                {/* Deadline */}
                {goal.deadline && (
                  <div className={`flex items-center space-x-1 text-xs mt-2 ${
                    isGoalOverdue(goal.deadline) ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    <Calendar className="w-3 h-3" />
                    <span>
                      Due {new Date(goal.deadline).toLocaleDateString()}
                    </span>
                    {isGoalOverdue(goal.deadline) && <AlertCircle className="w-3 h-3" />}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Card>

      {/* Progress Update Modal */}
      {selectedGoal && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Update Progress: {selectedGoal.title}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Progress: {selectedGoal.progress}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={progressUpdate}
                onChange={(e) => setProgressUpdate(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>0%</span>
                <span className="font-medium">{progressUpdate}%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleProgressUpdate}>
                Update Progress
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => {
                  setSelectedGoal(null)
                  setProgressUpdate(0)
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Goals Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Goals Summary
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {goals.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Goals</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {goals.filter(g => g.progress === 100).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {goals.filter(g => g.progress > 0 && g.progress < 100).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {goals.filter(g => isGoalOverdue(g.deadline) && g.progress < 100).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Overdue</div>
          </div>
        </div>
      </Card>
    </div>
  )
}

