import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

export default function ProtectedRoute({ children }) {
  const { user, loading, isAdmin } = useAuth()
  const { isDark } = useTheme()

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-yellow-600 border-t-transparent"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin-login" replace />
  }

  if (!isAdmin) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Access Denied</h2>
          <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>You don't have admin privileges.</p>
          <Link to="/" className="inline-block px-6 py-3 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 transition-colors">
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  return children
}
