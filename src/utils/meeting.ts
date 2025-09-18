import { Meeting, AgendaItem } from '@/types'

export const calculateMeetingProgress = (agenda: AgendaItem[]): number => {
  if (!agenda || agenda.length === 0) return 0
  
  const completedItems = agenda.filter(item => item.completed).length
  return Math.round((completedItems / agenda.length) * 100)
}

export const formatMeetingDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}

export const getMeetingStatusColor = (status: Meeting['status']): string => {
  switch (status) {
    case 'SCHEDULED':
      return 'bg-blue-100 text-blue-800'
    case 'IN_PROGRESS':
      return 'bg-green-100 text-green-800'
    case 'COMPLETED':
      return 'bg-gray-100 text-gray-800'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export const isMeetingUpcoming = (date: Date): boolean => {
  const now = new Date()
  const meetingDate = new Date(date)
  return meetingDate > now
}

export const getTimeUntilMeeting = (date: Date): string => {
  const now = new Date()
  const meetingDate = new Date(date)
  const diffMs = meetingDate.getTime() - now.getTime()
  
  if (diffMs < 0) return 'Past'
  
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  
  if (diffDays > 0) {
    return `${diffDays}d ${diffHours}h`
  } else if (diffHours > 0) {
    return `${diffHours}h ${diffMinutes}m`
  } else {
    return `${diffMinutes}m`
  }
}

export const createDefaultAgenda = (): AgendaItem[] => [
  {
    id: '1',
    title: 'Welcome & Introductions',
    description: 'Brief introductions and meeting overview',
    duration: 5,
    order: 1,
    completed: false
  },
  {
    id: '2',
    title: 'Review Objectives',
    description: 'Go through meeting objectives and agenda',
    duration: 10,
    order: 2,
    completed: false
  },
  {
    id: '3',
    title: 'Main Discussion',
    description: 'Core meeting content and discussion',
    duration: 30,
    order: 3,
    completed: false
  },
  {
    id: '4',
    title: 'Action Items & Next Steps',
    description: 'Identify action items and assign responsibilities',
    duration: 10,
    order: 4,
    completed: false
  },
  {
    id: '5',
    title: 'Wrap Up',
    description: 'Summary and meeting close',
    duration: 5,
    order: 5,
    completed: false
  }
]
