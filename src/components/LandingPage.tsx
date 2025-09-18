'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { Calendar, Target, Users, BarChart3, CheckCircle, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  const [isSigningIn, setIsSigningIn] = useState(false)

  const handleSignIn = async () => {
    setIsSigningIn(true)
    try {
      await signIn('credentials', { callbackUrl: '/' })
    } catch (error) {
      console.error('Sign in error:', error)
    } finally {
      setIsSigningIn(false)
    }
  }

  const features = [
    {
      icon: Calendar,
      title: 'Smart Meeting Planning',
      description: 'Create meetings with clear objectives, structured agendas, and automatic task generation.'
    },
    {
      icon: Target,
      title: 'Goal Tracking',
      description: 'Link meetings to goals and track progress from preparation through execution to follow-up.'
    },
    {
      icon: Users,
      title: 'Real-time Collaboration',
      description: 'Live note-taking, action item capture, and decision logging during meetings.'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Insights',
      description: 'Measure meeting effectiveness, track goal progress, and optimize team productivity.'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">MeetingFlow</span>
          </div>
          <button
            onClick={handleSignIn}
            disabled={isSigningIn}
            className="btn btn-primary flex items-center space-x-2"
          >
            {isSigningIn ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Transform Meetings Into
              <span className="text-gradient block">Actionable Workflows</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              The comprehensive meeting management platform that turns every meeting into trackable tasks, 
              measurable outcomes, and clear goal progress.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleSignIn}
                disabled={isSigningIn}
                className="btn btn-primary text-lg px-8 py-3 flex items-center justify-center space-x-2"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="btn btn-secondary text-lg px-8 py-3">
                Watch Demo
              </button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mt-24 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-24 bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Make Every Meeting Count?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Join teams who have transformed their meeting culture and achieved measurable results.
            </p>
            <button
              onClick={handleSignIn}
              disabled={isSigningIn}
              className="btn btn-primary text-lg px-8 py-3"
            >
              Start Your Free Trial
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2024 MeetingFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
