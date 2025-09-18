'use client'

import { useState, useEffect } from 'react'
import { X, Target, Calendar, FileText } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { Goal } from '@/types'

interface EditGoalModalProps {
  isOpen: boolean
  onClose: () => void
  onGoalUpdated: (updatedGoal: Goal) => void
  goal: Goal | null
}

export default function EditGoalModal({ isOpen, onClose, onGoalUpdated, goal }: EditGoalModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'PERSONAL' as 'PERSONAL' | 'TEAM' | 'DEPARTMENT' | 'COMPANY',
    deadline: ''
  })

  useEffect(() => {
    if (goal) {
      setFormData({
        title: goal.title,
        description: goal.description || '',
        type: goal.type,
        deadline: goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : ''
      })
    }
  }, [goal])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!goal) return

    const updatedGoal: Goal = {
      ...goal,
      title: formData.title,
      description: formData.description || null,
      type: formData.type,
      deadline: formData.deadline ? new Date(formData.deadline) : goal.deadline,
      updatedAt: new Date()
    }

    onGoalUpdated(updatedGoal)
    onClose()
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
                <Target className="w-5 h-5 text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Edit Goal
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Goal Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter goal title"
                required
                icon={<Target className="w-4 h-4" />}
              />

              <div>
                <label className="label">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter goal description"
                  className="input"
                  rows={3}
                />
              </div>

              <div>
                <label className="label">Goal Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="input"
                >
                  <option value="PERSONAL">Personal</option>
                  <option value="TEAM">Team</option>
                  <option value="DEPARTMENT">Department</option>
                  <option value="COMPANY">Company</option>
                </select>
              </div>

              <Input
                label="Deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                icon={<Calendar className="w-4 h-4" />}
              />

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
                  Update Goal
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}




