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

    const { priceId } = req.body

    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' })
    }

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${req.headers.origin}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/pricing?canceled=true`,
      customer_email: session.user.email,
      metadata: {
        userId: session.user.id || '',
      },
    })

    return res.status(200).json({ sessionId: checkoutSession.id })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

