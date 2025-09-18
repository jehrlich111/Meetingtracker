import { NextApiRequest, NextApiResponse } from 'next'
import AnthropicService from '@/lib/ai/anthropic'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { audioData, meetingContext } = req.body

    if (!audioData) {
      return res.status(400).json({ error: 'Audio data is required' })
    }

    // Convert base64 audio data to Blob
    const audioBlob = new Blob([Buffer.from(audioData, 'base64')], { type: 'audio/wav' })

    // Transcribe audio using Anthropic Claude
    const transcriptionResult = await AnthropicService.transcribeAudio(audioBlob)

    res.status(200).json({
      success: true,
      transcription: transcriptionResult
    })
  } catch (error) {
    console.error('Error transcribing audio:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to transcribe audio' 
    })
  }
}




