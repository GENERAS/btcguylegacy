import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const profileFetched = useRef(false)

  const loadProfile = async (userId, userEmail) => {
    if (profileFetched.current) return
    profileFetched.current = true

    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10000)

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()
        .abortSignal(controller.abort)

      clearTimeout(timeout)

      if (data) {
        setProfile(data)
        return
      }

      const { data: byEmail } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', userEmail)
        .maybeSingle()

      if (byEmail) {
        setProfile({ ...byEmail, id: userId })
        return
      }

      setProfile({ id: userId, email: userEmail, role: 'user' })
    } catch (e) {
      console.error('loadProfile error:', e)
      setProfile({ id: userId, email: userEmail, role: 'user' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadProfile(session.user.id, session.user.email)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)

      if (event === 'SIGNED_OUT' || !session) {
        setProfile(null)
        setLoading(false)
        profileFetched.current = false
        return
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (!profileFetched.current) {
          loadProfile(session.user.id, session.user.email)
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
  }

  const signInWithGithub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: window.location.origin }
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    profileFetched.current = false
  }

  const value = {
    user,
    profile,
    loading,
    signInWithGoogle,
    signInWithGithub,
    signOut,
    isAdmin: profile?.role === 'admin'
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
