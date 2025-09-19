import { NextApiRequest, NextApiResponse } from 'next'
import { stripe } from '@/lib/stripe'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const session = await getServerSession(req, res, authOptions)
    
    if (!session?.user?.email) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // Get or create customer
    const customers = await stripe.customers.list({
      email: session.user.email,
      limit: 1,
    })

    let customer
    if (customers.data.length > 0) {
      customer = customers.data[0]
    } else {
      customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name || undefined,
      })
    }

    // Create portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${req.headers.origin}/dashboard`,
    })

    return res.status(200).json({ url: portalSession.url })
  } catch (error) {
    console.error('Error creating portal session:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

