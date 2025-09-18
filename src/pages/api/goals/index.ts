import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db/prisma'
import { ApiResponse, Goal } from '@/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Goal[]>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const session = await getServerSession(req, res, authOptions)
    
    if (!session?.user?.email) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    const goals = await prisma.goal.findMany({
      where: {
        owner: {
          email: session.user.email
        }
      },
      include: {
        owner: true,
        parentGoal: true,
        subGoals: true,
        tasks: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.status(200).json({ success: true, data: goals })
  } catch (error) {
    console.error('Error fetching goals:', error)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
}
