import { Link } from 'react-router-dom'
import { FaCarCrash } from 'react-icons/fa'
import Button from '../components/Button'

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-ink-50">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white text-3xl shadow-lg shadow-brand-500/30 mb-6">
        <FaCarCrash />
      </div>
      <h1 className="font-display text-7xl md:text-9xl font-extrabold gradient-text mb-4">
        404
      </h1>
      <p className="text-2xl font-bold text-ink-900 mb-2">Wrong turn, driver!</p>
      <p className="text-ink-500 mb-8 max-w-md">
        The page you're looking for doesn't exist. Let's get you back on the road.
      </p>
      <Link to="/">
        <Button size="lg">Back to Home</Button>
      </Link>
    </div>
  )
}

export default NotFound