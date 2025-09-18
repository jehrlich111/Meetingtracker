import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface TranscriptionResult {
  text: string
  confidence: number
  language: string
}

export interface SummaryResult {
  summary: string
  keyPoints: string[]
  actionItems: string[]
  decisions: string[]
}

export class AnthropicService {
  /**
   * Transcribe audio using Anthropic Claude
   * Note: This is a placeholder implementation as Claude doesn't directly support audio transcription
   * In a real implementation, you would:
   * 1. Use a speech-to-text service (like Google Speech-to-Text, Azure Speech, or AssemblyAI)
   * 2. Send the transcribed text to Claude for processing
   */
  static async transcribeAudio(audioBlob: Blob): Promise<TranscriptionResult> {
    try {
      // In a real implementation, you would:
      // 1. Convert audio to text using a speech-to-text service
      // 2. Process the text with Claude for better accuracy
      
      // For demo purposes, return mock data
      return {
        text: "This is a simulated transcription using Anthropic Claude. In a real implementation, this would be processed by a speech-to-text service and then enhanced by Claude.",
        confidence: 0.95,
        language: "en"
      }
    } catch (error) {
      console.error('Error transcribing audio:', error)
      throw new Error('Failed to transcribe audio')
    }
  }

  /**
   * Generate meeting summary using Anthropic Claude
   */
  static async generateMeetingSummary(transcription: string, meetingContext?: {
    title: string
    objectives: string[]
    attendees: string[]
  }): Promise<SummaryResult> {
    try {
      const prompt = `Please analyze this meeting transcription and provide a comprehensive summary.

Meeting Context:
- Title: ${meetingContext?.title || 'Meeting'}
- Objectives: ${meetingContext?.objectives?.join(', ') || 'Not specified'}
- Attendees: ${meetingContext?.attendees?.join(', ') || 'Not specified'}

Transcription:
${transcription}

Please provide:
1. A concise summary of the meeting
2. Key points discussed
3. Action items identified
4. Decisions made

Format your response as JSON with the following structure:
{
  "summary": "Brief meeting summary",
  "keyPoints": ["Point 1", "Point 2", "Point 3"],
  "actionItems": ["Action 1", "Action 2", "Action 3"],
  "decisions": ["Decision 1", "Decision 2"]
}`

      const response = await anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 2000,
        temperature: 0.3,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })

      const content = response.content[0]
      if (content.type === 'text') {
        try {
          return JSON.parse(content.text)
        } catch (parseError) {
          // Fallback if JSON parsing fails
          return {
            summary: content.text,
            keyPoints: [],
            actionItems: [],
            decisions: []
          }
        }
      }

      throw new Error('Unexpected response format from Claude')
    } catch (error) {
      console.error('Error generating meeting summary:', error)
      // Return fallback summary
      return {
        summary: "Meeting summary could not be generated. Please review the transcription manually.",
        keyPoints: [],
        actionItems: [],
        decisions: []
      }
    }
  }

  /**
   * Extract action items from meeting transcription
   */
  static async extractActionItems(transcription: string): Promise<string[]> {
    try {
      const prompt = `Please extract action items from this meeting transcription. Return only the action items as a JSON array of strings.

Transcription:
${transcription}

Format: ["Action item 1", "Action item 2", "Action item 3"]`

      const response = await anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1000,
        temperature: 0.2,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })

      const content = response.content[0]
      if (content.type === 'text') {
        try {
          return JSON.parse(content.text)
        } catch (parseError) {
          return []
        }
      }

      return []
    } catch (error) {
      console.error('Error extracting action items:', error)
      return []
    }
  }

  /**
   * Generate meeting insights and recommendations
   */
  static async generateInsights(transcription: string, meetingData: {
    duration: number
    attendees: number
    objectives: string[]
  }): Promise<{
    effectiveness: number
    recommendations: string[]
    nextSteps: string[]
  }> {
    try {
      const prompt = `Please analyze this meeting and provide insights and recommendations.

Meeting Data:
- Duration: ${meetingData.duration} minutes
- Attendees: ${meetingData.attendees}
- Objectives: ${meetingData.objectives.join(', ')}

Transcription:
${transcription}

Please provide:
1. Meeting effectiveness score (0-100)
2. Recommendations for improvement
3. Suggested next steps

Format as JSON:
{
  "effectiveness": 85,
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "nextSteps": ["Next step 1", "Next step 2"]
}`

      const response = await anthropic.messages.create({
        model: "claude-3-sonnet-20240229",
        max_tokens: 1500,
        temperature: 0.3,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })

      const content = response.content[0]
      if (content.type === 'text') {
        try {
          return JSON.parse(content.text)
        } catch (parseError) {
          return {
            effectiveness: 75,
            recommendations: ["Review meeting structure", "Improve time management"],
            nextSteps: ["Follow up on action items", "Schedule next meeting"]
          }
        }
      }

      throw new Error('Unexpected response format from Claude')
    } catch (error) {
      console.error('Error generating insights:', error)
      return {
        effectiveness: 75,
        recommendations: ["Review meeting structure", "Improve time management"],
        nextSteps: ["Follow up on action items", "Schedule next meeting"]
      }
    }
  }
}

export default AnthropicService




