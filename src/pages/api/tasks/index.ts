import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { prisma } from '@/lib/db/prisma'
import { ApiResponse, Task } from '@/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Task[]>>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    const session = await getServerSession(req, res, authOptions)
    
    if (!session?.user?.email) {
      return res.status(401).json({ success: false, error: 'Unauthorized' })
    }

    const tasks = await prisma.task.findMany({
      where: {
        assignee: {
          email: session.user.email
        }
      },
      include: {
        assignee: true,
        meeting: true,
        goal: true
      },
      orderBy: [
        { priority: 'desc' },
        { dueDate: 'asc' }
      ]
    })

    res.status(200).json({ success: true, data: tasks })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
}
