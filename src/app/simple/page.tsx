'use client'

import { useSession } from 'next-auth/react'

export default function SimplePage() {
  const { data: session, status } = useSession()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple Page</h1>
        <p className="text-lg text-gray-600 mb-4">Session Status: {status}</p>
        {session ? (
          <div className="p-4 bg-green-100 rounded-lg">
            <p className="text-green-800">Logged in as: {session.user?.email}</p>
          </div>
        ) : (
          <div className="p-4 bg-yellow-100 rounded-lg">
            <p className="text-yellow-800">Not logged in</p>
          </div>
        )}
      </div>
    </div>
  )
}




