import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('🔐 Authorize called with:', { 
          email: credentials?.email, 
          hasPassword: !!credentials?.password 
        })

        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials')
          return null
        }

        // Demo users with different roles and their passwords
        const demoUsers = {
          'admin@meetingflow.com': {
            password: 'admin123',
            user: {
              id: 'admin-user-1',
              email: 'admin@meetingflow.com',
              name: 'Admin User',
              role: 'ADMIN'
            }
          },
          'user@meetingflow.com': {
            password: 'user123',
            user: {
              id: 'demo-user-1',
              email: 'user@meetingflow.com',
              name: 'Demo User',
              role: 'USER'
            }
          }
        }

        // Check if it's a demo user with correct password
        const userData = demoUsers[credentials.email as keyof typeof demoUsers]
        console.log('👤 User data found:', !!userData)
        
        if (userData) {
          console.log('🔑 Password check:', {
            provided: credentials.password,
            expected: userData.password,
            match: userData.password === credentials.password
          })
        }

        if (userData && userData.password === credentials.password) {
          console.log('✅ Authentication successful for:', credentials.email)
          return userData.user
        }

        console.log('❌ Authentication failed for:', credentials.email)
        return null
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).role = token.role
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin'
  },
  secret: process.env.NEXTAUTH_SECRET
}