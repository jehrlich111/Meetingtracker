'use client'

import { useState, useEffect } from 'react'
import { X, TrendingUp, Target } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { Goal } from '@/types'

interface UpdateProgressModalProps {
  isOpen: boolean
  onClose: () => void
  onProgressUpdated: (goalId: string, newProgress: number) => void
  goal: Goal | null
}

export default function UpdateProgressModal({ isOpen, onClose, onProgressUpdated, goal }: UpdateProgressModalProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (goal) {
      setProgress(goal.progress)
    }
  }, [goal])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!goal) return

    onProgressUpdated(goal.id, progress)
    onClose()
  }

  const handleQuickUpdate = (value: number) => {
    setProgress(value)
  }

  if (!isOpen || !goal) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="relative w-full max-w-md">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Update Progress
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {goal.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Current progress: {goal.progress}%
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="label">New Progress (%)</label>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => setProgress(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>0%</span>
                    <span className="font-medium text-primary-600">{progress}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              {/* Quick Update Buttons */}
              <div>
                <label className="label mb-3">Quick Updates</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuickUpdate(25)}
                    className="text-xs"
                  >
                    25%
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuickUpdate(50)}
                    className="text-xs"
                  >
                    50%
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuickUpdate(75)}
                    className="text-xs"
                  >
                    75%
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuickUpdate(100)}
                    className="text-xs"
                  >
                    100%
                  </Button>
                </div>
              </div>

              {/* Progress Preview */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                  <span>Progress Preview</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                >
                  Update Progress
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}




