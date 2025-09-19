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
    const { transcription, meetingContext } = req.body

    if (!transcription) {
      return res.status(400).json({ error: 'Transcription is required' })
    }

    // Generate meeting summary using Anthropic Claude
    const summaryResult = await AnthropicService.generateMeetingSummary(transcription, meetingContext)

    res.status(200).json({
      success: true,
      summary: summaryResult
    })
  } catch (error) {
    console.error('Error generating summary:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate summary' 
    })
  }
}





