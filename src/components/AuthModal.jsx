import { useAuth } from '../contexts/AuthContext'

export default function AuthModal({ onGuest }) {
  const { signInWithGoogle } = useAuth()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-sm mx-4 bg-th-surface border border-th-bd rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 text-center">
          <div className="w-10 h-10 bg-th-tx rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-th-surface text-[13px] font-bold">JH</span>
          </div>
          <h1 className="text-[20px] font-semibold text-th-tx mb-1">Juice's Harmonic</h1>
          <p className="text-[13px] text-th-tx3">Deal sourcing for ICONIQ Growth</p>
        </div>

        {/* Sign in */}
        <div className="px-8 pb-8 space-y-3">
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl bg-th-tx text-th-surface text-[14px] font-medium hover:opacity-90 transition-opacity"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-th-bd-sub" />
            <span className="text-[11px] text-th-tx4">or</span>
            <div className="flex-1 h-px bg-th-bd-sub" />
          </div>

          <button
            onClick={onGuest}
            className="w-full px-4 py-2.5 rounded-xl border border-th-bd text-[14px] font-medium text-th-tx2 hover:bg-th-hover hover:text-th-tx transition-colors"
          >
            Continue as guest
          </button>

          <p className="text-[11px] text-th-tx4 text-center leading-relaxed pt-1">
            Sign in with Google to share deals with collaborators,<br/>
            save CRM notes, and sync your pipeline across devices.
          </p>
        </div>
      </div>
    </div>
  )
}
