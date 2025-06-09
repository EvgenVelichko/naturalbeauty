import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { onAuthStateChange, getUserProfile } from '../lib/auth'
import type { UserProfile } from '../lib/auth'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  loading: true,
  refreshProfile: async () => {}
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshProfile = async () => {
    if (user) {
      try {
        const userProfile = await getUserProfile(user.id)
        setProfile(userProfile)
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }
  }

  useEffect(() => {
    const { data: { subscription } } = onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        await refreshProfile()
      } else {
        setProfile(null)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (user) {
      refreshProfile()
    }
  }, [user])

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}