'use client'

import { useState, useEffect } from 'react'
import { signIn, getSession, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Calendar, Mail, Lock, ArrowRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { data: session, status } = useSession()

  // Clear any existing session when the sign-in page loads
  useEffect(() => {
    const clearSession = async () => {
      console.log('🧹 Clearing any existing session...')
      try {
        await signOut({ redirect: false })
        console.log('✅ Session cleared successfully')
      } catch (error) {
        console.log('⚠️ Error clearing session:', error)
      }
    }
    clearSession()
  }, [])

  // If there's a session, redirect to dashboard
  useEffect(() => {
    if (status === 'authenticated' && session) {
      console.log('🔄 Session detected, redirecting to dashboard...')
      router.push('/')
    }
  }, [session, status, router])

  // Show loading while session is being cleared
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      console.log('🚀 Attempting sign in with:', { email, hasPassword: !!password })
      
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      console.log('📊 Sign in result:', result)

      if (result?.error) {
        console.log('❌ Sign in error:', result.error)
        setError('Invalid email or password')
        setIsLoading(false)
      } else if (result?.ok) {
        console.log('✅ Sign in successful, redirecting...')
        // Authentication successful, redirect to dashboard
        router.push('/')
      } else {
        console.log('⚠️ Unexpected result:', result)
        setError('An unexpected error occurred. Please try again.')
        setIsLoading(false)
      }
    } catch (error) {
      console.error('💥 Sign in error:', error)
      setError('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Sign in to MeetingFlow
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Transform your meetings into actionable workflows
          </p>
        </div>

        {/* Sign In Form */}
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              icon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              icon={<Lock className="w-4 h-4" />}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  Demo Credentials
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <strong>Admin Access:</strong>
                </p>
                <div className="text-sm font-mono text-gray-800 dark:text-gray-200">
                  <div>Email: admin@meetingflow.com</div>
                  <div>Password: admin123</div>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <strong>Regular User:</strong>
                </p>
                <div className="text-sm font-mono text-gray-800 dark:text-gray-200">
                  <div>Email: user@meetingflow.com</div>
                  <div>Password: user123</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <button className="text-primary-600 hover:text-primary-700 font-medium">
              Sign up for free
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
