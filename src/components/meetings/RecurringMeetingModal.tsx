'use client'

import { useState } from 'react'
import { X, Calendar, Repeat, Clock } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { Meeting } from '@/types'

interface RecurringMeetingModalProps {
  isOpen: boolean
  onClose: () => void
  onRecurringMeetingCreated: (meetings: Meeting[]) => void
  baseMeeting?: Partial<Meeting>
}

export default function RecurringMeetingModal({ 
  isOpen, 
  onClose, 
  onRecurringMeetingCreated,
  baseMeeting 
}: RecurringMeetingModalProps) {
  const [formData, setFormData] = useState({
    isRecurring: false,
    recurrencePattern: 'WEEKLY' as Meeting['recurrencePattern'],
    recurrenceInterval: 1,
    recurrenceEndDate: '',
    numberOfOccurrences: 4
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!formData.isRecurring) {
        // Single meeting
        const singleMeeting: Meeting = {
          id: Date.now().toString(),
          title: baseMeeting?.title || 'New Meeting',
          description: baseMeeting?.description,
          date: baseMeeting?.date || new Date(),
          duration: baseMeeting?.duration || 60,
          status: 'SCHEDULED',
          objectives: baseMeeting?.objectives || [],
          orgId: 'org1',
          createdAt: new Date(),
          updatedAt: new Date(),
          isRecurring: false
        }
        onRecurringMeetingCreated([singleMeeting])
      } else {
        // Generate recurring meetings
        const meetings: Meeting[] = []
        const startDate = baseMeeting?.date || new Date()
        const recurringMeetingId = Date.now().toString()
        
        let currentDate = new Date(startDate)
        let occurrenceCount = 0
        const maxOccurrences = formData.numberOfOccurrences

        while (occurrenceCount < maxOccurrences) {
          const meeting: Meeting = {
            id: `${recurringMeetingId}-${occurrenceCount}`,
            title: `${baseMeeting?.title || 'New Meeting'}${occurrenceCount > 0 ? ` (${occurrenceCount + 1})` : ''}`,
            description: baseMeeting?.description,
            date: new Date(currentDate),
            duration: baseMeeting?.duration || 60,
            status: 'SCHEDULED',
            objectives: baseMeeting?.objectives || [],
            orgId: 'org1',
            createdAt: new Date(),
            updatedAt: new Date(),
            isRecurring: true,
            recurrencePattern: formData.recurrencePattern,
            recurrenceInterval: formData.recurrenceInterval,
            recurrenceEndDate: formData.recurrenceEndDate ? new Date(formData.recurrenceEndDate) : undefined,
            recurringMeetingId,
            parentMeetingId: occurrenceCount === 0 ? undefined : `${recurringMeetingId}-0`
          }
          
          meetings.push(meeting)
          occurrenceCount++

          // Calculate next occurrence
          switch (formData.recurrencePattern) {
            case 'DAILY':
              currentDate.setDate(currentDate.getDate() + formData.recurrenceInterval)
              break
            case 'WEEKLY':
              currentDate.setDate(currentDate.getDate() + (7 * formData.recurrenceInterval))
              break
            case 'MONTHLY':
              currentDate.setMonth(currentDate.getMonth() + formData.recurrenceInterval)
              break
            case 'YEARLY':
              currentDate.setFullYear(currentDate.getFullYear() + formData.recurrenceInterval)
              break
          }

          // Check if we've reached the end date
          if (formData.recurrenceEndDate && currentDate > new Date(formData.recurrenceEndDate)) {
            break
          }
        }

        onRecurringMeetingCreated(meetings)
      }
      
      onClose()
    } catch (error) {
      console.error('Error creating recurring meetings:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <Repeat className="w-5 h-5 mr-2" />
              Recurring Meeting
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
            {/* Recurring Toggle */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isRecurring"
                name="isRecurring"
                checked={formData.isRecurring}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="isRecurring" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Make this a recurring meeting
              </label>
            </div>

            {formData.isRecurring && (
              <>
                {/* Recurrence Pattern */}
                <div>
                  <label className="label">
                    Repeat
                  </label>
                  <select
                    name="recurrencePattern"
                    value={formData.recurrencePattern}
                    onChange={handleChange}
                    className="input"
                  >
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                    <option value="YEARLY">Yearly</option>
                  </select>
                </div>

                {/* Recurrence Interval */}
                <div>
                  <label className="label">
                    Every
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      name="recurrenceInterval"
                      value={formData.recurrenceInterval}
                      onChange={handleChange}
                      className="input w-20"
                      min="1"
                      max="99"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {formData.recurrencePattern === 'DAILY' && 'day(s)'}
                      {formData.recurrencePattern === 'WEEKLY' && 'week(s)'}
                      {formData.recurrencePattern === 'MONTHLY' && 'month(s)'}
                      {formData.recurrencePattern === 'YEARLY' && 'year(s)'}
                    </span>
                  </div>
                </div>

                {/* Number of Occurrences */}
                <div>
                  <label className="label">
                    Number of occurrences
                  </label>
                  <input
                    type="number"
                    name="numberOfOccurrences"
                    value={formData.numberOfOccurrences}
                    onChange={handleChange}
                    className="input"
                    min="1"
                    max="52"
                  />
                </div>

                {/* End Date (Optional) */}
                <div>
                  <label className="label">
                    End date (optional)
                  </label>
                  <input
                    type="date"
                    name="recurrenceEndDate"
                    value={formData.recurrenceEndDate}
                    onChange={handleChange}
                    className="input"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </>
            )}

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
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Creating...' : formData.isRecurring ? 'Create Recurring Meetings' : 'Create Meeting'}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}





