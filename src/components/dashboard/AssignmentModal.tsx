'use client'

import { useState, useEffect } from 'react'
import { X, User, Calendar, Target, CheckSquare, Plus } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { Meeting, Task, Goal, User as UserType } from '@/types'

interface AssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  onAssignmentCreated: (assignment: AssignmentData) => void
  meetings: Meeting[]
  users: UserType[]
  goals: Goal[]
}

interface AssignmentData {
  type: 'task' | 'goal'
  title: string
  description: string
  assigneeId: string
  meetingId?: string
  goalId?: string
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate?: Date
  deadline?: Date
}

export default function AssignmentModal({
  isOpen,
  onClose,
  onAssignmentCreated,
  meetings,
  users,
  goals
}: AssignmentModalProps) {
  const [assignmentType, setAssignmentType] = useState<'task' | 'goal'>('task')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assigneeId, setAssigneeId] = useState('')
  const [meetingId, setMeetingId] = useState('')
  const [goalId, setGoalId] = useState('')
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'>('MEDIUM')
  const [dueDate, setDueDate] = useState('')
  const [deadline, setDeadline] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setTitle('')
      setDescription('')
      setAssigneeId('')
      setMeetingId('')
      setGoalId('')
      setPriority('MEDIUM')
      setDueDate('')
      setDeadline('')
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !assigneeId) return

    setIsLoading(true)
    try {
      const assignmentData: AssignmentData = {
        type: assignmentType,
        title: title.trim(),
        description: description.trim(),
        assigneeId,
        meetingId: meetingId || undefined,
        goalId: goalId || undefined,
        priority: assignmentType === 'task' ? priority : undefined,
        dueDate: assignmentType === 'task' && dueDate ? new Date(dueDate) : undefined,
        deadline: assignmentType === 'goal' && deadline ? new Date(deadline) : undefined
      }

      onAssignmentCreated(assignmentData)
      onClose()
    } catch (error) {
      console.error('Error creating assignment:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Assign {assignmentType === 'task' ? 'Task' : 'Goal'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Assignment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assignment Type
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setAssignmentType('task')}
                  className={`flex items-center px-4 py-2 rounded-lg border ${
                    assignmentType === 'task'
                      ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                      : 'border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300'
                  }`}
                >
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Task
                </button>
                <button
                  type="button"
                  onClick={() => setAssignmentType('goal')}
                  className={`flex items-center px-4 py-2 rounded-lg border ${
                    assignmentType === 'goal'
                      ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                      : 'border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300'
                  }`}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Goal
                </button>
              </div>
            </div>

            {/* Title */}
            <Input
              label={`${assignmentType === 'task' ? 'Task' : 'Goal'} Title`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`Enter ${assignmentType === 'task' ? 'task' : 'goal'} title`}
              required
            />

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={`Describe the ${assignmentType === 'task' ? 'task' : 'goal'}`}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                rows={3}
              />
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assign to
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Select a person</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name || user.email}
                  </option>
                ))}
              </select>
            </div>

            {/* Meeting (optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Link to Meeting (Optional)
              </label>
              <select
                value={meetingId}
                onChange={(e) => setMeetingId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">No meeting</option>
                {meetings.map((meeting) => (
                  <option key={meeting.id} value={meeting.id}>
                    {meeting.title} - {meeting.date.toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            {/* Goal (optional for tasks) */}
            {assignmentType === 'task' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Link to Goal (Optional)
                </label>
                <select
                  value={goalId}
                  onChange={(e) => setGoalId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">No goal</option>
                  {goals.map((goal) => (
                    <option key={goal.id} value={goal.id}>
                      {goal.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Priority (for tasks) */}
            {assignmentType === 'task' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
            )}

            {/* Due Date (for tasks) */}
            {assignmentType === 'task' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Due Date (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            )}

            {/* Deadline (for goals) */}
            {assignmentType === 'goal' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Deadline (Optional)
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !title.trim() || !assigneeId}
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create {assignmentType === 'task' ? 'Task' : 'Goal'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}


