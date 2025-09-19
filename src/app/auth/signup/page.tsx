'use client'

import { useState, useEffect } from 'react'
import { signIn, getSession, signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Calendar, Mail, Lock, User, ArrowRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { data: session, status } = useSession()

  // Clear any existing session when the signup page loads
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setIsLoading(false)
      return
    }

    try {
      console.log('🚀 Attempting signup with:', { 
        name: formData.name, 
        email: formData.email, 
        hasPassword: !!formData.password 
      })
      
      // For now, we'll create a demo user and sign them in
      // In a real app, you'd make an API call to create the user
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      console.log('📊 Signup result:', result)

      if (result?.error) {
        console.log('❌ Signup error:', result.error)
        setError('Account creation failed. Please try again.')
        setIsLoading(false)
      } else if (result?.ok) {
        console.log('✅ Signup successful, redirecting to pricing...')
        // Redirect to pricing page to choose a plan
        router.push('/pricing')
      } else {
        console.log('⚠️ Unexpected result:', result)
        setError('An unexpected error occurred. Please try again.')
        setIsLoading(false)
      }
    } catch (error) {
      console.error('💥 Signup error:', error)
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
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Start transforming your meetings today
          </p>
        </div>

        {/* Sign Up Form */}
        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <Input
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              icon={<User className="w-4 h-4" />}
            />

            <Input
              label="Email address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              icon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              icon={<Lock className="w-4 h-4" />}
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
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
                  Create Account
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
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-4">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => router.push('/auth/signin')}
              >
                Sign In Instead
              </Button>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            By creating an account, you agree to our{' '}
            <button className="text-primary-600 hover:text-primary-700 font-medium">
              Terms of Service
            </button>
            {' '}and{' '}
            <button className="text-primary-600 hover:text-primary-700 font-medium">
              Privacy Policy
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
