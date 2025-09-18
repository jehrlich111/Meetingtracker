'use client'

import { useState, useEffect } from 'react'
import { Meeting, MeetingNote, Task, Decision, AgendaItem } from '@/types'
import { Calendar, Clock, Users, Target, CheckSquare, MessageSquare, Plus, Save } from 'lucide-react'
import { calculateMeetingProgress, formatMeetingDuration } from '@/utils/meeting'

interface LiveMeetingProps {
  meeting: Meeting
  onUpdateMeeting: (updates: Partial<Meeting>) => void
}

export default function LiveMeeting({ meeting, onUpdateMeeting }: LiveMeetingProps) {
  const [notes, setNotes] = useState<MeetingNote[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [decisions, setDecisions] = useState<Decision[]>([])
  const [currentNote, setCurrentNote] = useState('')
  const [newTask, setNewTask] = useState({ title: '', description: '', assignee: '' })
  const [newDecision, setNewDecision] = useState({ description: '', context: '' })
  const [agenda, setAgenda] = useState<AgendaItem[]>(meeting.agenda || [])
  const [objectives, setObjectives] = useState<string[]>(meeting.objectives || [])

  const progress = calculateMeetingProgress(agenda)

  const addNote = () => {
    if (currentNote.trim()) {
      const note: MeetingNote = {
        id: Date.now().toString(),
        content: currentNote,
        meetingId: meeting.id,
        authorId: 'current-user',
        timestamp: new Date(),
        createdAt: new Date()
      }
      setNotes([...notes, note])
      setCurrentNote('')
    }
  }

  const addTask = () => {
    if (newTask.title.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        status: 'NOT_STARTED',
        priority: 'MEDIUM',
        assigneeId: newTask.assignee || undefined,
        meetingId: meeting.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      setTasks([...tasks, task])
      setNewTask({ title: '', description: '', assignee: '' })
    }
  }

  const addDecision = () => {
    if (newDecision.description.trim()) {
      const decision: Decision = {
        id: Date.now().toString(),
        description: newDecision.description,
        context: newDecision.context,
        meetingId: meeting.id,
        authorId: 'current-user',
        implementationStatus: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      setDecisions([...decisions, decision])
      setNewDecision({ description: '', context: '' })
    }
  }

  const toggleAgendaItem = (index: number) => {
    const newAgenda = [...agenda]
    newAgenda[index].completed = !newAgenda[index].completed
    setAgenda(newAgenda)
  }

  const toggleObjective = (index: number) => {
    const newObjectives = [...objectives]
    // For demo purposes, we'll just mark as completed
    // In real implementation, you'd track completion status
    setObjectives(newObjectives)
  }

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status } : task
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {meeting.title}
              </h1>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(meeting.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatMeetingDuration(meeting.duration)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{meeting.attendees?.length || 0} attendees</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 dark:text-gray-400">Progress</div>
              <div className="text-2xl font-bold text-primary-600">{progress}%</div>
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Side - Agenda & Objectives */}
            <div className="space-y-6">
              {/* Objectives */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Meeting Objectives
                </h3>
                <div className="space-y-3">
                  {objectives.map((objective, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleObjective(index)}
                        className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center hover:border-primary-500"
                      >
                        <CheckSquare className="w-3 h-3 text-primary-600" />
                      </button>
                      <span className="text-gray-900 dark:text-white">{objective}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agenda */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Meeting Agenda
                </h3>
                <div className="space-y-4">
                  {agenda.map((item, index) => (
                    <div key={item.id} className={`p-4 rounded-lg border-2 transition-colors ${
                      item.completed 
                        ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
                        : 'border-gray-200 dark:border-gray-700'
                    }`}>
                      <div className="flex items-start space-x-3">
                        <button
                          onClick={() => toggleAgendaItem(index)}
                          className={`w-5 h-5 border-2 rounded flex items-center justify-center mt-0.5 ${
                            item.completed 
                              ? 'border-green-500 bg-green-500' 
                              : 'border-gray-300 hover:border-primary-500'
                          }`}
                        >
                          {item.completed && <CheckSquare className="w-3 h-3 text-white" />}
                        </button>
                        <div className="flex-1">
                          <h4 className={`font-medium ${
                            item.completed 
                              ? 'line-through text-gray-500' 
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {item.title}
                          </h4>
                          {item.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {item.description}
                            </p>
                          )}
                          <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>{item.duration} minutes</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Notes, Tasks, Decisions */}
            <div className="space-y-6">
              {/* Notes */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Meeting Notes
                </h3>
                
                <div className="space-y-3 mb-4">
                  {notes.map((note) => (
                    <div key={note.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-900 dark:text-white">{note.content}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(note.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <input
                    value={currentNote}
                    onChange={(e) => setCurrentNote(e.target.value)}
                    placeholder="Add a note..."
                    className="input flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addNote())}
                  />
                  <button
                    onClick={addNote}
                    className="btn btn-primary flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Tasks */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <CheckSquare className="w-5 h-5 mr-2" />
                  Action Items
                </h3>
                
                <div className="space-y-3 mb-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">{task.title}</h4>
                          {task.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {task.description}
                            </p>
                          )}
                        </div>
                        <select
                          value={task.status}
                          onChange={(e) => updateTaskStatus(task.id, e.target.value as Task['status'])}
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="NOT_STARTED">Not Started</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <input
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Task title"
                    className="input"
                  />
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Description (optional)"
                    rows={2}
                    className="input"
                  />
                  <div className="flex space-x-2">
                    <input
                      value={newTask.assignee}
                      onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                      placeholder="Assignee email"
                      className="input flex-1"
                    />
                    <button
                      onClick={addTask}
                      className="btn btn-primary flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Decisions */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Key Decisions
                </h3>
                
                <div className="space-y-3 mb-4">
                  {decisions.map((decision) => (
                    <div key={decision.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white">{decision.description}</h4>
                      {decision.context && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {decision.context}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <input
                    value={newDecision.description}
                    onChange={(e) => setNewDecision({ ...newDecision, description: e.target.value })}
                    placeholder="Decision description"
                    className="input"
                  />
                  <textarea
                    value={newDecision.context}
                    onChange={(e) => setNewDecision({ ...newDecision, context: e.target.value })}
                    placeholder="Context (optional)"
                    rows={2}
                    className="input"
                  />
                  <button
                    onClick={addDecision}
                    className="btn btn-primary w-full flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Decision</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
