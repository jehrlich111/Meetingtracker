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
    const { transcription, meetingData } = req.body

    if (!transcription || !meetingData) {
      return res.status(400).json({ error: 'Transcription and meeting data are required' })
    }

    // Generate meeting insights using Anthropic Claude
    const insights = await AnthropicService.generateInsights(transcription, meetingData)

    res.status(200).json({
      success: true,
      insights
    })
  } catch (error) {
    console.error('Error generating insights:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate insights' 
    })
  }
}





