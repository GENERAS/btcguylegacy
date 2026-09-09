import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useNavigate } from 'react-router-dom'
import { FaGoogle, FaGithub, FaCrown, FaShieldAlt } from 'react-icons/fa'

export default function AdminLoginPage() {
  const { signInWithGoogle, signInWithGithub, user, loading, isAdmin } = useAuth()
  const { isDark } = useTheme()
  const navigate = useNavigate()

  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin')
    }
  }, [user, isAdmin, navigate])

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-yellow-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-yellow-500/10">
              <FaCrown className="text-4xl text-yellow-600" />
            </div>
            <div className="p-3 rounded-xl bg-yellow-600/10">
              <FaShieldAlt className="text-4xl text-yellow-700" />
            </div>
          </div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Admin Access</h1>
          <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Restricted to authorized personnel only</p>
        </div>

        <div className={`rounded-2xl p-8 border shadow-sm ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <h2 className={`text-lg font-semibold mb-6 text-center ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Sign in with</h2>

          <div className="space-y-3">
            <button
              onClick={signInWithGoogle}
              className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition border border-gray-200"
            >
              <FaGoogle className="text-red-500" /> Continue with Google
            </button>
            <button
              onClick={signInWithGithub}
              className={`w-full font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition ${
                isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-900 hover:bg-gray-800 text-white'
              }`}
            >
              <FaGithub /> Continue with GitHub
            </button>
          </div>

          <p className={`text-xs text-center mt-6 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Secure admin access only. Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </div>
  )
}
