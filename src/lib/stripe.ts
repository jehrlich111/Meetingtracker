import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
  typescript: true,
})

export const STRIPE_CONFIG = {
  priceId: process.env.STRIPE_PRICE_ID || 'price_1234567890', // Replace with your actual price ID
  currency: 'usd',
  amount: 1000, // $10.00 in cents
  interval: 'month' as const,
}

