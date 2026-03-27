import { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import { getWorkspaceInviteCode } from '../lib/supabase'

export default function SettingsModal({ onClose }) {
  const { theme, toggle } = useTheme()
  const { user, isGuest, displayName, avatarUrl, workspaceId, signOut, signInWithGoogle } = useAuth()
  const [inviteLink, setInviteLink] = useState(null)
  const [copied, setCopied] = useState(false)
  const [loadingInvite, setLoadingInvite] = useState(false)

  const generateInviteLink = async () => {
    setLoadingInvite(true)
    try {
      const data = await getWorkspaceInviteCode(workspaceId)
      const link = `${window.location.origin}?invite=${data.invite_code}`
      setInviteLink(link)
    } catch { setInviteLink(null) }
    setLoadingInvite(false)
  }

  const copyLink = async () => {
    if (!inviteLink) return
    await navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/30" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] z-50 bg-th-surface border border-th-bd rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-th-bd-sub">
          <h2 className="text-[15px] font-semibold text-th-tx">Settings</h2>
          <button onClick={onClose} className="text-th-tx3 hover:text-th-tx transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="px-5 py-4 space-y-5">
          {/* Account */}
          <div>
            <div className="text-[11px] font-medium text-th-tx3 uppercase tracking-wider mb-2">Account</div>
            {isGuest ? (
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-th-tx2">Signed in as guest</span>
                <button
                  onClick={signInWithGoogle}
                  className="text-[12px] px-3 py-1.5 rounded-lg bg-th-tx text-th-surface font-medium hover:opacity-90 transition-opacity"
                >
                  Sign in with Google
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {avatarUrl
                    ? <img src={avatarUrl} className="w-8 h-8 rounded-full" alt="" />
                    : <div className="w-8 h-8 rounded-full bg-th-hover flex items-center justify-center text-[12px] font-medium text-th-tx">{displayName[0]?.toUpperCase()}</div>
                  }
                  <div>
                    <div className="text-[13px] font-medium text-th-tx">{displayName}</div>
                    <div className="text-[11px] text-th-tx3">{user?.email}</div>
                  </div>
                </div>
                <button
                  onClick={signOut}
                  className="text-[12px] text-th-tx3 hover:text-th-tx transition-colors"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>

          {/* Appearance */}
          <div>
            <div className="text-[11px] font-medium text-th-tx3 uppercase tracking-wider mb-2">Appearance</div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[13px] text-th-tx font-medium">Theme</div>
                <div className="text-[11px] text-th-tx3">Switch between light and dark mode</div>
              </div>
              <button
                onClick={toggle}
                className={`relative w-11 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-blue-600' : 'bg-th-bd'}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${theme === 'dark' ? 'translate-x-5' : ''}`} />
              </button>
            </div>
          </div>

          {/* Workspace invite */}
          {!isGuest && workspaceId && (
            <div>
              <div className="text-[11px] font-medium text-th-tx3 uppercase tracking-wider mb-2">Workspace</div>
              <p className="text-[12px] text-th-tx2 mb-3">
                Share this link to invite collaborators to your deal workspace. They'll see all deals you add and can add their own.
              </p>
              {inviteLink ? (
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={inviteLink}
                    className="flex-1 bg-th-hover border border-th-bd rounded-lg px-3 py-1.5 text-[11px] text-th-tx2 font-mono truncate focus:outline-none"
                  />
                  <button
                    onClick={copyLink}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${copied ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-th-hover border border-th-bd text-th-tx2 hover:text-th-tx'}`}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={generateInviteLink}
                  disabled={loadingInvite}
                  className="px-4 py-2 rounded-lg bg-th-hover border border-th-bd text-[12px] font-medium text-th-tx2 hover:text-th-tx transition-colors disabled:opacity-50"
                >
                  {loadingInvite ? 'Generating...' : 'Generate invite link'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
