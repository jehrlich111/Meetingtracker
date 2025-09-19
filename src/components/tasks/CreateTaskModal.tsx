'use client'

import { useState } from 'react'
import { X, Calendar, AlertCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { Task } from '@/types'

interface CreateTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onTaskCreated: (task: Task) => void
}

export default function CreateTaskModal({ isOpen, onClose, onTaskCreated }: CreateTaskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM' as Task['priority'],
    dueDate: '',
    effort: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const newTask: Task = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description || undefined,
        status: 'NOT_STARTED',
        priority: formData.priority,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        effort: formData.effort ? parseInt(formData.effort) : undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      onTaskCreated(newTask)
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: 'MEDIUM',
        dueDate: '',
        effort: ''
      })
      
      onClose()
    } catch (error) {
      console.error('Error creating task:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Create New Task
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="label">
                Task Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="input"
                placeholder="Enter task title"
              />
            </div>

            {/* Description */}
            <div>
              <label className="label">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input min-h-[80px] resize-none"
                placeholder="Enter task description (optional)"
              />
            </div>

            {/* Priority and Due Date Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div>
                <label className="label">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="input"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {/* Effort Estimation */}
            <div>
              <label className="label">
                Effort (hours)
              </label>
              <input
                type="number"
                name="effort"
                value={formData.effort}
                onChange={handleChange}
                className="input"
                placeholder="Estimated hours"
                min="0"
                step="0.5"
              />
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.title.trim()}
                className="flex-1"
              >
                {isSubmitting ? 'Creating...' : 'Create Task'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}





