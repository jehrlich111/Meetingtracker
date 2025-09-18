'use client'

import { useSession } from 'next-auth/react'
import LandingPage from '@/components/LandingPage'
import Dashboard from '@/components/dashboard/Dashboard'

export default function Home() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return <LandingPage />
  }

  return <Dashboard />
}