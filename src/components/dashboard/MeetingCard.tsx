'use client'

import { Meeting } from '@/types'
import { Calendar, Clock, Users, Target } from 'lucide-react'
import { formatMeetingDuration, getTimeUntilMeeting, getMeetingStatusColor } from '@/utils/meeting'

interface MeetingCardProps {
  meeting: Meeting
  onClick?: () => void
}

export default function MeetingCard({ meeting, onClick }: MeetingCardProps) {
  const timeUntil = getTimeUntilMeeting(meeting.date)
  const statusColor = getMeetingStatusColor(meeting.status)

  return (
    <div 
      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {meeting.title}
        </h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
          {meeting.status.replace('_', ' ')}
        </span>
      </div>
      
      {meeting.description && (
        <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm">
          {meeting.description}
        </p>
      )}

      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
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

      {timeUntil !== 'Past' && (
        <div className="text-sm text-primary-600 dark:text-primary-400 font-medium mb-3">
          {timeUntil} until meeting
        </div>
      )}

      {meeting.objectives.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Target className="w-4 h-4" />
            <span>Objectives:</span>
          </div>
          <ul className="space-y-1">
            {meeting.objectives.slice(0, 2).map((objective, index) => (
              <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                <span className="w-1.5 h-1.5 bg-primary-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                {objective}
              </li>
            ))}
            {meeting.objectives.length > 2 && (
              <li className="text-sm text-gray-500 dark:text-gray-500">
                +{meeting.objectives.length - 2} more objectives
              </li>
            )}
          </ul>
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <button 
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          onClick={(e) => {
            e.stopPropagation()
            onClick?.()
          }}
        >
          View Details →
        </button>
      </div>
    </div>
  )
}
