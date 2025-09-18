'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Plus, Calendar, Clock, Users, Target, Repeat, Filter } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import MeetingForm from '@/components/meeting/MeetingForm'
import RecurringMeetingModal from '@/components/meetings/RecurringMeetingModal'
import Navigation from '@/components/Navigation'
import { Meeting } from '@/types'
import { formatMeetingDuration, getTimeUntilMeeting, getMeetingStatusColor } from '@/utils/meeting'

export default function MeetingsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [showForm, setShowForm] = useState(false)
  const [showRecurringModal, setShowRecurringModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'current' | 'completed'>('all')

  useEffect(() => {
    fetchMeetings()
  }, [])

  const fetchMeetings = async () => {
    try {
      // Mock data for demo
      const mockMeetings: Meeting[] = [
        {
          id: '1',
          title: 'Weekly Team Standup',
          description: 'Review progress and plan for the week',
          date: new Date(Date.now() + 2 * 60 * 60 * 1000),
          duration: 30,
          status: 'SCHEDULED',
          objectives: ['Review last week progress', 'Plan this week tasks', 'Identify blockers'],
          orgId: 'org1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          title: 'Product Planning Session',
          description: 'Plan Q1 product roadmap',
          date: new Date(Date.now() + 24 * 60 * 60 * 1000),
          duration: 120,
          status: 'SCHEDULED',
          objectives: ['Define Q1 goals', 'Prioritize features', 'Assign responsibilities'],
          orgId: 'org1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '3',
          title: 'Client Review Meeting',
          description: 'Review project progress with client',
          date: new Date(Date.now() - 24 * 60 * 60 * 1000),
          duration: 60,
          status: 'COMPLETED',
          objectives: ['Present progress', 'Gather feedback', 'Plan next steps'],
          orgId: 'org1',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
      setMeetings(mockMeetings)
    } catch (error) {
      console.error('Error fetching meetings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateMeeting = (meetingData: any) => {
    // In a real app, this would make an API call
    const newMeeting: Meeting = {
      id: Date.now().toString(),
      ...meetingData,
      status: 'SCHEDULED',
      orgId: 'org1',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    setMeetings([newMeeting, ...meetings])
    setShowForm(false)
  }

  const handleRecurringMeetingsCreated = (newMeetings: Meeting[]) => {
    setMeetings(prev => [...newMeetings, ...prev])
    setShowRecurringModal(false)
  }

  const getFilteredMeetings = () => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    switch (activeFilter) {
      case 'upcoming':
        return meetings.filter(m => m.status === 'SCHEDULED' && new Date(m.date) > now)
      case 'current':
        return meetings.filter(m => {
          const meetingDate = new Date(m.date)
          const meetingEnd = new Date(meetingDate.getTime() + m.duration * 60 * 1000)
          return m.status === 'SCHEDULED' && meetingDate <= now && meetingEnd >= now
        })
      case 'completed':
        return meetings.filter(m => m.status === 'COMPLETED')
      default:
        return meetings
    }
  }

  const filteredMeetings = getFilteredMeetings()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 lg:ml-64">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Meetings
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Manage your meetings and track progress
              </p>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Meeting</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex space-x-1">
            <Button
              variant={activeFilter === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveFilter('all')}
              className="flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>All Meetings</span>
            </Button>
            <Button
              variant={activeFilter === 'upcoming' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveFilter('upcoming')}
              className="flex items-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Upcoming</span>
            </Button>
            <Button
              variant={activeFilter === 'current' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveFilter('current')}
              className="flex items-center space-x-2"
            >
              <Clock className="w-4 h-4" />
              <span>Current</span>
            </Button>
            <Button
              variant={activeFilter === 'completed' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveFilter('completed')}
              className="flex items-center space-x-2"
            >
              <Target className="w-4 h-4" />
              <span>Completed</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {showForm ? (
            <Card className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Create New Meeting
                </h2>
                <div className="flex space-x-3">
                  <Button
                    variant="secondary"
                    onClick={() => setShowRecurringModal(true)}
                    className="flex items-center space-x-2"
                  >
                    <Repeat className="w-4 h-4" />
                    <span>Make Recurring</span>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
              <MeetingForm
                onSubmit={handleCreateMeeting}
                onCancel={() => setShowForm(false)}
              />
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Total Meetings
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {activeFilter === 'all' ? meetings.length : filteredMeetings.length}
                      </p>
                    </div>
                    <Calendar className="w-8 h-8 text-primary-600" />
                  </div>
                </Card>
                
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {activeFilter === 'upcoming' ? 'Scheduled' : 'Upcoming'}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {activeFilter === 'all' ? meetings.filter(m => m.status === 'SCHEDULED').length : 
                         activeFilter === 'upcoming' ? filteredMeetings.length :
                         meetings.filter(m => m.status === 'SCHEDULED').length}
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-green-600" />
                  </div>
                </Card>
                
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {activeFilter === 'completed' ? 'Finished' : 'Completed'}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {activeFilter === 'all' ? meetings.filter(m => m.status === 'COMPLETED').length :
                         activeFilter === 'completed' ? filteredMeetings.length :
                         meetings.filter(m => m.status === 'COMPLETED').length}
                      </p>
                    </div>
                    <Target className="w-8 h-8 text-blue-600" />
                  </div>
                </Card>
                
                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {activeFilter === 'current' ? 'In Progress' : 'Total Attendees'}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {activeFilter === 'current' ? filteredMeetings.length :
                         filteredMeetings.reduce((sum, m) => sum + (m.attendees?.length || 0), 0)}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                </Card>
              </div>

              {/* Meetings List */}
              <div className="space-y-4">
                {filteredMeetings.map((meeting) => (
                  <Card key={meeting.id} className="p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {meeting.title}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMeetingStatusColor(meeting.status)}`}>
                            {meeting.status.replace('_', ' ')}
                          </span>
                        </div>
                        
                        {meeting.description && (
                          <p className="text-gray-600 dark:text-gray-400 mb-3">
                            {meeting.description}
                          </p>
                        )}

                        <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
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
                          {meeting.status === 'SCHEDULED' && (
                            <div className="text-primary-600 font-medium">
                              {getTimeUntilMeeting(meeting.date)}
                            </div>
                          )}
                        </div>

                        {meeting.objectives.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Objectives:
                            </p>
                            <ul className="space-y-1">
                              {meeting.objectives.slice(0, 3).map((objective, index) => (
                                <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                                  <span className="w-1.5 h-1.5 bg-primary-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                  {objective}
                                </li>
                              ))}
                              {meeting.objectives.length > 3 && (
                                <li className="text-sm text-gray-500 dark:text-gray-500">
                                  +{meeting.objectives.length - 3} more objectives
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => router.push(`/meetings/${meeting.id}`)}
                        >
                          View
                        </Button>
                        {meeting.status === 'SCHEDULED' && (
                          <Button 
                            size="sm"
                            onClick={() => router.push(`/meetings/${meeting.id}`)}
                          >
                            Join Meeting
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
                
                {filteredMeetings.length === 0 && (
                  <Card className="p-12 text-center">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      {activeFilter === 'all' ? 'No meetings yet' : 
                       activeFilter === 'upcoming' ? 'No upcoming meetings' :
                       activeFilter === 'current' ? 'No current meetings' :
                       'No completed meetings'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {activeFilter === 'all' ? 'Get started by creating your first meeting.' :
                       activeFilter === 'upcoming' ? 'No meetings are scheduled for the future.' :
                       activeFilter === 'current' ? 'No meetings are currently in progress.' :
                       'No meetings have been completed yet.'}
                    </p>
                    {activeFilter === 'all' && (
                      <Button onClick={() => setShowForm(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Meeting
                      </Button>
                    )}
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recurring Meeting Modal */}
      <RecurringMeetingModal
        isOpen={showRecurringModal}
        onClose={() => setShowRecurringModal(false)}
        onRecurringMeetingCreated={handleRecurringMeetingsCreated}
      />
    </div>
    </>
  )
}
