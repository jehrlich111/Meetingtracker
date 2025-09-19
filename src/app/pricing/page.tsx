'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle, Star } from 'lucide-react'
import Button from '@/components/ui/Button'
import PricingCard from '@/components/pricing/PricingCard'
import Navigation from '@/components/Navigation'

export default function PricingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSubscribe = async () => {
    if (!session) {
      router.push('/auth/signup')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || 'price_1234567890',
        }),
      })

      const { sessionId } = await response.json()
      
      if (sessionId) {
        const stripe = (await import('@stripe/stripe-js')).loadStripe(
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
        )
        
        const stripeInstance = await stripe
        if (stripeInstance) {
          await stripeInstance.redirectToCheckout({ sessionId })
        }
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
    } finally {
      setLoading(false)
    }
  }

  const features = [
    'Unlimited meetings and participants',
    'AI-powered meeting summaries',
    'Goal tracking and task management',
    'Department management',
    'Meeting templates and agendas',
    'Real-time collaboration tools',
    'Advanced analytics and reporting',
    'Priority customer support',
    'Custom integrations',
    'Data export and backup'
  ]

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 lg:ml-64">
        <div className="px-6 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <Button
              variant="ghost"
              onClick={() => router.push('/')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Button>
            
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Unlock the full potential of your meetings with our comprehensive management platform
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Free Plan */}
              <PricingCard
                name="Free"
                price="$0"
                description="Perfect for getting started"
                features={[
                  'Up to 5 meetings per month',
                  'Basic meeting notes',
                  'Simple task tracking',
                  'Email support'
                ]}
                onSubscribe={() => router.push('/')}
                loading={false}
              />

              {/* Pro Plan */}
              <PricingCard
                name="Pro"
                price="$10"
                description="Everything you need for productive meetings"
                features={features}
                isPopular={true}
                onSubscribe={handleSubscribe}
                loading={loading}
              />
            </div>
          </div>

          {/* Features Comparison */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Why Choose Our Platform?
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  AI-Powered Insights
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Get intelligent summaries, action items, and insights from every meeting automatically.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Team Collaboration
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Seamlessly manage departments, assign tasks, and track progress across your organization.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Advanced Analytics
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Track meeting effectiveness, team productivity, and goal completion with detailed reports.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="max-w-3xl mx-auto space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Can I cancel my subscription anytime?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Yes, you can cancel your subscription at any time. You'll continue to have access to Pro features until the end of your billing period.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Is there a free trial?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Yes! You can start with our free plan and upgrade to Pro whenever you're ready. No credit card required for the free plan.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We accept all major credit cards through Stripe, including Visa, Mastercard, American Express, and Discover.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  How secure is my data?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your data is encrypted and stored securely. We follow industry best practices and comply with data protection regulations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

