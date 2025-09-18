'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { 
  Play, 
  Pause, 
  Square, 
  Clock, 
  Mic, 
  MicOff, 
  Target, 
  CheckSquare, 
  Users, 
  Calendar,
  ArrowLeft,
  Save,
  Download,
  Share2,
  Mail,
  X
} from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import AIRecording from '@/components/meeting/AIRecording'
import GoalTracker from '@/components/meeting/GoalTracker'
import { Meeting, Task, Goal, MeetingNote, Decision, AgendaItem } from '@/types'
import { formatMeetingDuration, calculateMeetingProgress } from '@/utils/meeting'

export default function MeetingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [meeting, setMeeting] = useState<Meeting | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [isTimerPaused, setIsTimerPaused] = useState(false)
  const [timerElapsed, setTimerElapsed] = useState(0)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])
  const [currentAgendaIndex, setCurrentAgendaIndex] = useState(0)
  const [notes, setNotes] = useState<MeetingNote[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [decisions, setDecisions] = useState<Decision[]>([])
  const [currentNote, setCurrentNote] = useState('')
  const [newTask, setNewTask] = useState({ title: '', description: '', assignee: '' })
  const [newDecision, setNewDecision] = useState({ description: '', context: '' })
  const [agenda, setAgenda] = useState<AgendaItem[]>([])
  const [objectives, setObjectives] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [transcription, setTranscription] = useState('')
  const [aiSummary, setAiSummary] = useState('')

  useEffect(() => {
    if (params?.id) {
      fetchMeeting()
    }
  }, [params?.id])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording, isPaused])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning && !isTimerPaused) {
      interval = setInterval(() => {
        setTimerElapsed(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, isTimerPaused])

  const fetchMeeting = async () => {
    try {
      // Mock meeting data
      const mockMeeting: Meeting = {
        id: params?.id as string || '1',
        title: 'Weekly Team Standup',
        description: 'Review progress and plan for the week',
        date: new Date(),
        duration: 30,
        status: 'IN_PROGRESS',
        objectives: ['Review last week progress', 'Plan this week tasks', 'Identify blockers'],
        agenda: [
          {
            id: '1',
            title: 'Welcome & Check-ins',
            description: 'Brief team check-ins and updates',
            duration: 5,
            order: 1,
            completed: false
          },
          {
            id: '2',
            title: 'Last Week Review',
            description: 'Review accomplishments and challenges',
            duration: 10,
            order: 2,
            completed: false
          },
          {
            id: '3',
            title: 'This Week Planning',
            description: 'Plan tasks and priorities for the week',
            duration: 10,
            order: 3,
            completed: false
          },
          {
            id: '4',
            title: 'Blockers & Support',
            description: 'Identify and address any blockers',
            duration: 5,
            order: 4,
            completed: false
          }
        ],
        orgId: 'org1',
        createdAt: new Date(),
        updatedAt: new Date(),
        attendees: [
          {
            id: '1',
            meetingId: params?.id as string || '1',
            userId: '1',
            role: 'ORGANIZER',
            prepStatus: 'COMPLETED',
            createdAt: new Date(),
            user: {
              id: '1',
              email: 'admin@meetingflow.com',
              name: 'Admin User',
              role: 'ADMIN',
              createdAt: new Date(),
              updatedAt: new Date()
            }
          },
          {
            id: '2',
            meetingId: params?.id as string || '1',
            userId: '2',
            role: 'PARTICIPANT',
            prepStatus: 'IN_PROGRESS',
            createdAt: new Date(),
            user: {
              id: '2',
              email: 'john.doe@company.com',
              name: 'John Doe',
              role: 'USER',
              createdAt: new Date(),
              updatedAt: new Date()
            }
          },
          {
            id: '3',
            meetingId: params?.id as string || '1',
            userId: '3',
            role: 'PARTICIPANT',
            prepStatus: 'NOT_STARTED',
            createdAt: new Date(),
            user: {
              id: '3',
              email: 'jane.smith@company.com',
              name: 'Jane Smith',
              role: 'USER',
              createdAt: new Date(),
              updatedAt: new Date()
            }
          },
          {
            id: '4',
            meetingId: params?.id as string || '1',
            userId: '4',
            role: 'OBSERVER',
            prepStatus: 'NOT_STARTED',
            createdAt: new Date(),
            user: {
              id: '4',
              email: 'mike.wilson@company.com',
              name: 'Mike Wilson',
              role: 'USER',
              createdAt: new Date(),
              updatedAt: new Date()
            }
          }
        ]
      }

      setMeeting(mockMeeting)
      setAgenda(mockMeeting.agenda || [])
      setObjectives(mockMeeting.objectives || [])
    } catch (error) {
      console.error('Error fetching meeting:', error)
    } finally {
      setLoading(false)
    }
  }

  const startRecording = () => {
    setIsRecording(true)
    setIsPaused(false)
    // In a real app, this would start actual recording
    console.log('Recording started')
  }

  const pauseRecording = () => {
    setIsPaused(!isPaused)
    console.log(isPaused ? 'Recording resumed' : 'Recording paused')
  }

  const stopRecording = () => {
    setIsRecording(false)
    setIsPaused(false)
    setTimeElapsed(0)
    console.log('Recording stopped')
  }

  const startTimer = () => {
    setIsTimerRunning(true)
    setIsTimerPaused(false)
    console.log('Timer started')
  }

  const pauseTimer = () => {
    setIsTimerPaused(!isTimerPaused)
    console.log(isTimerPaused ? 'Timer resumed' : 'Timer paused')
  }

  const stopTimer = () => {
    setIsTimerRunning(false)
    setIsTimerPaused(false)
    setTimerElapsed(0)
    console.log('Timer stopped')
  }

  const handleStopTimer = () => {
    stopTimer()
    // Initialize selected participants with all attendees
    if (meeting?.attendees) {
      setSelectedParticipants(meeting.attendees.map(attendee => attendee.userId))
    }
    // Show email notification modal when timer is stopped
    setShowEmailModal(true)
  }

  const handleParticipantToggle = (userId: string) => {
    setSelectedParticipants(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSelectAllParticipants = () => {
    if (meeting?.attendees) {
      setSelectedParticipants(meeting.attendees.map(attendee => attendee.userId))
    }
  }

  const handleDeselectAllParticipants = () => {
    setSelectedParticipants([])
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const addNote = () => {
    if (currentNote.trim()) {
      const note: MeetingNote = {
        id: Date.now().toString(),
        content: currentNote,
        meetingId: meeting!.id,
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
        meetingId: meeting!.id,
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
        meetingId: meeting!.id,
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
    
    // Auto-advance to next agenda item
    if (newAgenda[index].completed && index < newAgenda.length - 1) {
      setCurrentAgendaIndex(index + 1)
    }
  }

  const toggleObjective = (index: number) => {
    // For demo purposes, we'll just mark as completed
    console.log(`Objective ${index} toggled`)
  }

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status, updatedAt: new Date() } : task
    ))
  }

  const handleTranscriptionUpdate = (text: string) => {
    setTranscription(text)
  }

  const handleSummaryGenerated = (summary: string) => {
    setAiSummary(summary)
  }

  const handleGoalUpdate = (goalId: string, progress: number) => {
    console.log(`Goal ${goalId} updated to ${progress}%`)
  }

  const progress = calculateMeetingProgress(agenda)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!meeting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Meeting not found
          </h1>
          <Button onClick={() => router.push('/meetings')}>
            Back to Meetings
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 lg:ml-64">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/meetings')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {meeting.title}
                </h1>
                <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
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
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Recording Controls */}
              <div className="flex items-center space-x-2">
                {!isRecording ? (
                  <Button onClick={startRecording} className="flex items-center space-x-2">
                    <Mic className="w-4 h-4" />
                    <span>Start Recording</span>
                  </Button>
                ) : (
                  <>
                    <Button onClick={pauseRecording} variant="secondary" className="flex items-center space-x-2">
                      {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                      <span>{isPaused ? 'Resume' : 'Pause'}</span>
                    </Button>
                    <Button onClick={stopRecording} variant="danger" className="flex items-center space-x-2">
                      <Square className="w-4 h-4" />
                      <span>Stop</span>
                    </Button>
                  </>
                )}
              </div>

              {/* Timer Controls */}
              <div className="flex items-center space-x-2">
                {!isTimerRunning ? (
                  <Button onClick={startTimer} className="flex items-center space-x-2">
                    <Play className="w-4 h-4" />
                    <span>Start Timer</span>
                  </Button>
                ) : (
                  <>
                    <Button onClick={pauseTimer} variant="secondary" className="flex items-center space-x-2">
                      {isTimerPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                      <span>{isTimerPaused ? 'Resume' : 'Pause'}</span>
                    </Button>
                    <Button onClick={handleStopTimer} variant="danger" className="flex items-center space-x-2">
                      <Square className="w-4 h-4" />
                      <span>Stop Timer</span>
                    </Button>
                  </>
                )}
              </div>
              
              {/* Timer Display */}
              <div className="text-right">
                <div className="text-2xl font-bold text-primary-600">
                  {formatTime(timerElapsed)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {isTimerRunning ? (isTimerPaused ? 'Timer Paused' : 'Timer Running') : 'Timer Ready'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Side - Agenda & Objectives */}
            <div className="lg:col-span-2 space-y-6">
              {/* Progress Bar */}
              <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Meeting Progress
                  </h3>
                  <span className="text-2xl font-bold text-primary-600">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </Card>

              {/* Objectives */}
              <Card className="p-6">
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
              </Card>

              {/* Agenda */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Meeting Agenda
                </h3>
                <div className="space-y-4">
                  {agenda.map((item, index) => (
                    <div key={item.id} className={`p-4 rounded-lg border-2 transition-colors ${
                      item.completed 
                        ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
                        : index === currentAgendaIndex
                        ? 'border-primary-200 bg-primary-50 dark:border-primary-800 dark:bg-primary-900/20'
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
                            {index === currentAgendaIndex && (
                              <span className="text-primary-600 font-medium">• Current</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Side - AI Recording, Goals, Notes, Tasks, Decisions */}
            <div className="space-y-6">
              {/* AI Recording */}
              <AIRecording
                onTranscriptionUpdate={handleTranscriptionUpdate}
                onSummaryGenerated={handleSummaryGenerated}
              />

              {/* Goal Tracker */}
              <GoalTracker
                meetingId={meeting.id}
                onGoalUpdate={handleGoalUpdate}
              />

              {/* Meeting Notes */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Mic className="w-5 h-5 mr-2" />
                  Meeting Notes
                </h3>
                
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
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
                  <Button onClick={addNote} size="sm">
                    <Save className="w-4 h-4" />
                  </Button>
                </div>
              </Card>

              {/* Action Items */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <CheckSquare className="w-5 h-5 mr-2" />
                  Action Items
                </h3>
                
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {tasks.map((task) => (
                    <div key={task.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm">{task.title}</h4>
                          {task.description && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
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

                <div className="space-y-2">
                  <input
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Task title"
                    className="input text-sm"
                  />
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Description (optional)"
                    rows={2}
                    className="input text-sm"
                  />
                  <div className="flex space-x-2">
                    <input
                      value={newTask.assignee}
                      onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                      placeholder="Assignee email"
                      className="input flex-1 text-sm"
                    />
                    <Button onClick={addTask} size="sm">
                      <CheckSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Decisions */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Key Decisions
                </h3>
                
                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                  {decisions.map((decision) => (
                    <div key={decision.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">{decision.description}</h4>
                      {decision.context && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {decision.context}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <input
                    value={newDecision.description}
                    onChange={(e) => setNewDecision({ ...newDecision, description: e.target.value })}
                    placeholder="Decision description"
                    className="input text-sm"
                  />
                  <textarea
                    value={newDecision.context}
                    onChange={(e) => setNewDecision({ ...newDecision, context: e.target.value })}
                    placeholder="Context (optional)"
                    rows={2}
                    className="input text-sm"
                  />
                  <Button onClick={addDecision} className="w-full" size="sm">
                    Add Decision
                  </Button>
                </div>
              </Card>

              {/* Meeting Actions */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Meeting Actions
                </h3>
                <div className="space-y-2">
                  <Button className="w-full" variant="secondary">
                    <Download className="w-4 h-4 mr-2" />
                    Export Notes
                  </Button>
                  <Button className="w-full" variant="secondary">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Summary
                  </Button>
                  <Button className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Save Meeting
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Email Summary Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Email Meeting Summary
                </h3>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Select which participants to email a summary of this meeting:
                </p>
                
                {/* Participant Selection */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">Participants</h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSelectAllParticipants}
                        className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        Select All
                      </button>
                      <span className="text-gray-300 dark:text-gray-600">|</span>
                      <button
                        onClick={handleDeselectAllParticipants}
                        className="text-xs text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        Deselect All
                      </button>
                    </div>
                  </div>
                  
                  <div className="max-h-32 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg">
                    {meeting?.attendees?.map((attendee) => (
                      <div key={attendee.userId} className="flex items-center p-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <input
                          type="checkbox"
                          id={`participant-${attendee.userId}`}
                          checked={selectedParticipants.includes(attendee.userId)}
                          onChange={() => handleParticipantToggle(attendee.userId)}
                          className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <label 
                          htmlFor={`participant-${attendee.userId}`}
                          className="ml-3 text-sm text-gray-900 dark:text-white cursor-pointer flex-1"
                        >
                          <div className="flex items-center">
                            <div className="w-6 h-6 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mr-2">
                              <span className="text-xs font-medium text-primary-600 dark:text-primary-400">
                                {attendee.user?.name?.charAt(0) || attendee.user?.email?.charAt(0) || 'U'}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">{attendee.user?.name || 'Unknown User'}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{attendee.user?.email}</div>
                            </div>
                          </div>
                        </label>
                      </div>
                    )) || (
                      <div className="p-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                        No participants found
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Summary will include:</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Meeting duration: {formatTime(timerElapsed)}</li>
                    <li>• Meeting objectives and agenda</li>
                    <li>• Action items and tasks created</li>
                    <li>• Decisions made</li>
                    {aiSummary && <li>• AI-generated summary</li>}
                    {transcription && <li>• Meeting transcription</li>}
                  </ul>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedParticipants.length} participant{selectedParticipants.length !== 1 ? 's' : ''} selected
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="ghost"
                    onClick={() => setShowEmailModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      if (selectedParticipants.length === 0) {
                        alert('Please select at least one participant to send the summary to.')
                        return
                      }
                      // In a real app, this would send the email
                      console.log('Sending email summary to selected participants:', selectedParticipants)
                      setShowEmailModal(false)
                      // Show success message
                      alert(`Meeting summary sent to ${selectedParticipants.length} participant${selectedParticipants.length !== 1 ? 's' : ''}!`)
                    }}
                    disabled={selectedParticipants.length === 0}
                    className="flex items-center space-x-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Send Summary</span>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
