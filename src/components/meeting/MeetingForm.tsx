'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Calendar, Clock, Target, Users, Plus, X, Save } from 'lucide-react'
import { MeetingFormData, AgendaItem } from '@/types'
import { createDefaultAgenda } from '@/utils/meeting'

const meetingSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  date: z.date(),
  duration: z.number().min(15, 'Duration must be at least 15 minutes'),
  objectives: z.array(z.string()).min(1, 'At least one objective is required'),
  attendees: z.array(z.string()).min(1, 'At least one attendee is required'),
})

interface MeetingFormProps {
  onSubmit: (data: MeetingFormData) => void
  onCancel: () => void
  initialData?: Partial<MeetingFormData>
}

export default function MeetingForm({ onSubmit, onCancel, initialData }: MeetingFormProps) {
  const [agenda, setAgenda] = useState<AgendaItem[]>(
    initialData?.agenda || createDefaultAgenda()
  )
  const [newObjective, setNewObjective] = useState('')
  const [newAttendee, setNewAttendee] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<MeetingFormData>({
    resolver: zodResolver(meetingSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      date: initialData?.date || new Date(),
      duration: initialData?.duration || 60,
      objectives: initialData?.objectives || [],
      attendees: initialData?.attendees || [],
    }
  })

  const objectives = watch('objectives')
  const attendees = watch('attendees')

  const addObjective = () => {
    if (newObjective.trim()) {
      setValue('objectives', [...objectives, newObjective.trim()])
      setNewObjective('')
    }
  }

  const removeObjective = (index: number) => {
    setValue('objectives', objectives.filter((_, i) => i !== index))
  }

  const addAttendee = () => {
    if (newAttendee.trim() && !attendees.includes(newAttendee.trim())) {
      setValue('attendees', [...attendees, newAttendee.trim()])
      setNewAttendee('')
    }
  }

  const removeAttendee = (index: number) => {
    setValue('attendees', attendees.filter((_, i) => i !== index))
  }

  const updateAgendaItem = (index: number, updates: Partial<AgendaItem>) => {
    const newAgenda = [...agenda]
    newAgenda[index] = { ...newAgenda[index], ...updates }
    setAgenda(newAgenda)
  }

  const addAgendaItem = () => {
    const newItem: AgendaItem = {
      id: Date.now().toString(),
      title: '',
      description: '',
      duration: 15,
      order: agenda.length + 1,
      completed: false
    }
    setAgenda([...agenda, newItem])
  }

  const removeAgendaItem = (index: number) => {
    setAgenda(agenda.filter((_, i) => i !== index))
  }

  const onFormSubmit = (data: MeetingFormData) => {
    onSubmit({
      ...data,
      agenda
    })
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Meeting Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Title *</label>
            <input
              {...register('title')}
              className="input"
              placeholder="Enter meeting title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>
          
          <div>
            <label className="label">Duration (minutes) *</label>
            <input
              {...register('duration', { valueAsNumber: true })}
              type="number"
              min="15"
              className="input"
            />
            {errors.duration && (
              <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label className="label">Date & Time *</label>
          <input
            {...register('date', { valueAsDate: true })}
            type="datetime-local"
            className="input"
          />
          {errors.date && (
            <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
          )}
        </div>

        <div className="mt-4">
          <label className="label">Description</label>
          <textarea
            {...register('description')}
            rows={3}
            className="input"
            placeholder="Brief description of the meeting"
          />
        </div>
      </div>

      {/* Objectives */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Meeting Objectives
        </h3>
        
        <div className="space-y-3">
          {objectives.map((objective, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-primary-600" />
              <span className="flex-1 text-gray-900 dark:text-white">{objective}</span>
              <button
                type="button"
                onClick={() => removeObjective(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex space-x-2 mt-4">
          <input
            value={newObjective}
            onChange={(e) => setNewObjective(e.target.value)}
            placeholder="Add new objective"
            className="input flex-1"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addObjective())}
          />
          <button
            type="button"
            onClick={addObjective}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
        {errors.objectives && (
          <p className="text-red-500 text-sm mt-1">{errors.objectives.message}</p>
        )}
      </div>

      {/* Agenda */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Meeting Agenda
        </h3>
        
        <div className="space-y-4">
          {agenda.map((item, index) => (
            <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <input
                    value={item.title}
                    onChange={(e) => updateAgendaItem(index, { title: e.target.value })}
                    placeholder="Agenda item title"
                    className="input mb-2"
                  />
                  <textarea
                    value={item.description}
                    onChange={(e) => updateAgendaItem(index, { description: e.target.value })}
                    placeholder="Description (optional)"
                    rows={2}
                    className="input"
                  />
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="label">Duration (min)</label>
                    <input
                      type="number"
                      min="5"
                      value={item.duration}
                      onChange={(e) => updateAgendaItem(index, { duration: parseInt(e.target.value) || 15 })}
                      className="input"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAgendaItem(index)}
                    className="btn btn-danger w-full flex items-center justify-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addAgendaItem}
          className="btn btn-secondary mt-4 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Agenda Item</span>
        </button>
      </div>

      {/* Attendees */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Attendees
        </h3>
        
        <div className="space-y-3">
          {attendees.map((attendee, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-primary-600" />
              <span className="flex-1 text-gray-900 dark:text-white">{attendee}</span>
              <button
                type="button"
                onClick={() => removeAttendee(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex space-x-2 mt-4">
          <input
            value={newAttendee}
            onChange={(e) => setNewAttendee(e.target.value)}
            placeholder="Add attendee email"
            type="email"
            className="input flex-1"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAttendee())}
          />
          <button
            type="button"
            onClick={addAttendee}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
        {errors.attendees && (
          <p className="text-red-500 text-sm mt-1">{errors.attendees.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary flex items-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>Create Meeting</span>
        </button>
      </div>
    </form>
  )
}
