import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase, getOrCreateWorkspace, joinWorkspaceByCode } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [workspaceId, setWorkspaceId] = useState(() => {
    try { return localStorage.getItem('jh_workspace_id') } catch { return null }
  })
  const [inviteCode, setInviteCode] = useState(null)

  const initWorkspace = useCallback(async (u) => {
    if (!supabase || !u) return
    // Check for pending invite in URL
    const params = new URLSearchParams(window.location.search)
    const pendingInvite = params.get('invite')
    try {
      let wsId
      if (pendingInvite) {
        wsId = await joinWorkspaceByCode(u.id, pendingInvite)
        // Clean URL
        window.history.replaceState({}, '', window.location.pathname)
      } else {
        wsId = await getOrCreateWorkspace(u.id, u.email)
      }
      setWorkspaceId(wsId)
      try { localStorage.setItem('jh_workspace_id', wsId) } catch {}
    } catch (e) {
      console.warn('Workspace init error:', e)
    }
  }, [])

  useEffect(() => {
    if (!supabase) { setLoading(false); return }

    supabase.auth.getSession().then(({ data: { session } }) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) initWorkspace(u)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u && (event === 'SIGNED_IN')) initWorkspace(u)
      if (event === 'SIGNED_OUT') {
        setWorkspaceId(null)
        try { localStorage.removeItem('jh_workspace_id') } catch {}
      }
    })

    return () => subscription?.unsubscribe()
  }, [initWorkspace])

  const signInWithGoogle = () => supabase?.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  })

  const signOut = () => supabase?.auth.signOut()

  const isGuest = !user
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Guest'
  const avatarUrl = user?.user_metadata?.avatar_url

  return (
    <AuthContext.Provider value={{
      user, loading, workspaceId, isGuest,
      displayName, avatarUrl, inviteCode, setInviteCode,
      signInWithGoogle, signOut,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
