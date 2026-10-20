import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth()

  // Still loading auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Role check (if roles are specified)
  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cream-50 px-6 text-center">
        <div className="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 text-3xl mb-6">
          🚫
        </div>
        <h1 className="font-display text-3xl font-bold text-warm-900 mb-2">
          Access Denied
        </h1>
        <p className="text-warm-700 max-w-md mb-6">
          You don't have permission to view this page. Your role is{' '}
          <strong className="capitalize">{user.role}</strong>.
        </p>
        <a
          href="/"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold hover:shadow-lg transition-all"
        >
          Back to Home
        </a>
      </div>
    )
  }

  // Authorized → render children
  return children
}

export default ProtectedRoute