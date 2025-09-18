'use client'

import { useState } from 'react'
import { X, Calendar, User, Target, Clock } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { Task, Meeting, User } from '@/types'

interface QuickTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onTaskCreated: (task: Task) => void
  meetings: Meeting[]
  users: User[]
}

export default function QuickTaskModal({ 
  isOpen, 
  onClose, 
  onTaskCreated, 
  meetings, 
  users 
}: QuickTaskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM' as Task['priority'],
    dueDate: '',
    effort: '',
    assignedToUserId: '',
    meetingId: '',
    isUrgent: false
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
        priority: formData.isUrgent ? 'URGENT' : formData.priority,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        effort: formData.effort ? parseInt(formData.effort) : undefined,
        assignedToUserId: formData.assignedToUserId || undefined,
        meetingId: formData.meetingId || undefined,
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
        effort: '',
        assignedToUserId: '',
        meetingId: '',
        isUrgent: false
      })
      
      onClose()
    } catch (error) {
      console.error('Error creating task:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Quick Add Task
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
                placeholder="What needs to be done?"
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
                className="input min-h-[60px] resize-none"
                placeholder="Add more details (optional)"
              />
            </div>

            {/* Priority and Urgent */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  disabled={formData.isUrgent}
                  className="input"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              <div className="flex items-center space-x-3 pt-6">
                <input
                  type="checkbox"
                  id="isUrgent"
                  name="isUrgent"
                  checked={formData.isUrgent}
                  onChange={handleChange}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <label htmlFor="isUrgent" className="text-sm font-medium text-red-600">
                  Mark as Urgent
                </label>
              </div>
            </div>

            {/* Due Date and Effort */}
            <div className="grid grid-cols-2 gap-4">
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
            </div>

            {/* Assignment */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">
                  Assign to
                </label>
                <select
                  name="assignedToUserId"
                  value={formData.assignedToUserId}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Select person</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name || user.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">
                  Related Meeting
                </label>
                <select
                  name="meetingId"
                  value={formData.meetingId}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Select meeting</option>
                  {meetings.map((meeting) => (
                    <option key={meeting.id} value={meeting.id}>
                      {meeting.title}
                    </option>
                  ))}
                </select>
              </div>
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
