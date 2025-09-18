import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db/prisma'
import { ApiResponse, Meeting } from '@/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Meeting[]>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const session = await getServerSession(req, res, authOptions)
    
    if (!session?.user?.email) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    const meetings = await prisma.meeting.findMany({
      where: {
        attendees: {
          some: {
            user: {
              email: session.user.email
            }
          }
        }
      },
      include: {
        attendees: {
          include: {
            user: true
          }
        },
        tasks: true,
        notes: true,
        decisions: true
      },
      orderBy: {
        date: 'asc'
      }
    })

    res.status(200).json({ success: true, data: meetings })
  } catch (error) {
    console.error('Error fetching meetings:', error)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
}
