'use client'

import { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, Square, Play, Pause, Download, Trash2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import AnthropicService from '@/lib/ai/anthropic'

interface AIRecordingProps {
  onTranscriptionUpdate: (text: string) => void
  onSummaryGenerated: (summary: string) => void
}

export default function AIRecording({ onTranscriptionUpdate, onSummaryGenerated }: AIRecordingProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [transcription, setTranscription] = useState('')
  const [summary, setSummary] = useState('')
  const [recordingTime, setRecordingTime] = useState(0)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Check for microphone permission
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => setHasPermission(true))
      .catch(() => setHasPermission(false))
  }, [])

  useEffect(() => {
    if (isRecording && !isPaused) {
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRecording, isPaused])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: Blob[] = []

      recorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' })
        setAudioChunks(chunks)
        processAudio(audioBlob)
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
      setIsPaused(false)
      setRecordingTime(0)
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Could not access microphone. Please check permissions.')
    }
  }

  const pauseRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.pause()
      setIsPaused(true)
    } else if (mediaRecorder && mediaRecorder.state === 'paused') {
      mediaRecorder.resume()
      setIsPaused(false)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop()
      mediaRecorder.stream.getTracks().forEach(track => track.stop())
      setMediaRecorder(null)
      setIsRecording(false)
      setIsPaused(false)
    }
  }

  const processAudio = async (audioBlob: Blob) => {
    try {
      // Use Anthropic Claude for transcription and summary
      const transcriptionResult = await AnthropicService.transcribeAudio(audioBlob)
      setTranscription(transcriptionResult.text)
      onTranscriptionUpdate(transcriptionResult.text)
      
      // Generate AI summary using Claude
      const summaryResult = await AnthropicService.generateMeetingSummary(transcriptionResult.text, {
        title: "Meeting Recording",
        objectives: ["Review progress", "Plan next steps"],
        attendees: ["Team members"]
      })
      
      const formattedSummary = `Meeting Summary:\n\n${summaryResult.summary}\n\nKey Points:\n${summaryResult.keyPoints.map(point => `• ${point}`).join('\n')}\n\nAction Items:\n${summaryResult.actionItems.map(item => `• ${item}`).join('\n')}\n\nDecisions:\n${summaryResult.decisions.map(decision => `• ${decision}`).join('\n')}`
      
      setSummary(formattedSummary)
      onSummaryGenerated(formattedSummary)
    } catch (error) {
      console.error('Error processing audio:', error)
      // Fallback to mock data if API fails
      const mockTranscription = "This is a simulated transcription of the meeting. In a real application, this would be processed by Anthropic Claude API to convert the audio to text. The transcription would then be used to generate meeting summaries and extract action items."
      
      setTranscription(mockTranscription)
      onTranscriptionUpdate(mockTranscription)
      
      setTimeout(() => {
        const mockSummary = "Meeting Summary:\n\n• Discussed project progress and upcoming deadlines\n• Identified key blockers and action items\n• Planned next steps for the team\n• Made important decisions about project direction"
        setSummary(mockSummary)
        onSummaryGenerated(mockSummary)
      }, 2000)
    }
  }

  const downloadRecording = () => {
    if (audioChunks.length > 0) {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
      const url = URL.createObjectURL(audioBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `meeting-recording-${new Date().toISOString().split('T')[0]}.wav`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const clearRecording = () => {
    setTranscription('')
    setSummary('')
    setAudioChunks([])
    setRecordingTime(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (hasPermission === false) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <MicOff className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Microphone Access Required
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Please allow microphone access to enable AI recording and transcription.
          </p>
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Recording Controls */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Mic className="w-5 h-5 mr-2" />
            AI Recording & Transcription
          </h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-600">
              {formatTime(recordingTime)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {isRecording ? (isPaused ? 'Paused' : 'Recording') : 'Ready'}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
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
          
          {audioChunks.length > 0 && (
            <div className="flex space-x-2">
              <Button onClick={downloadRecording} variant="ghost" size="sm">
                <Download className="w-4 h-4" />
              </Button>
              <Button onClick={clearRecording} variant="ghost" size="sm">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Live Transcription */}
      {transcription && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Live Transcription
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 max-h-64 overflow-y-auto">
            <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
              {transcription}
            </p>
          </div>
        </Card>
      )}

      {/* AI Summary */}
      {summary && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            AI Generated Summary
          </h3>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
              {summary}
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
