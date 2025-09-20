import { useForm, Link } from '@inertiajs/react'
import PatternBackground from '@/components/PatternBackground'

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    username: '',
    password: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/login')
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-olive">
      {/* Subtle Icons Background */}
      <PatternBackground overrides={{ grapes: 'absolute -bottom-10 left-2 lg:left-6 w-22 lg:w-36 rotate-[-1deg] -translate-x-4' }} />

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="bg-beige-light backdrop-blur-sm p-8 rounded-none shadow-2xl w-full max-w-md">
          {/* Logo/Branding */}
          <div className="text-center mb-8">
            <img
              src="/assets/logo/lymaolive.webp"
              alt="LYMA"
              className="mx-auto mb-2 h-16 w-auto"
            />
            <p className="text-gray-600 font-lexend font-light text-sm">Welcome back</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-lexend font-semibold text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-olive transition-colors"
                placeholder="Enter your username"
                value={data.username}
                onChange={e => setData('username', e.target.value)}
              />
              {errors.username && (
                <div className="text-red-500 text-sm mt-1">{errors.username}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-lexend font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive focus:border-olive transition-colors"
                placeholder="Enter your password"
                value={data.password}
                onChange={e => setData('password', e.target.value)}
              />
              {errors.password && (
                <div className="text-red-500 text-sm mt-1">{errors.password}</div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-olive text-beige py-3 px-4 rounded-lg font-medium hover:bg-olive-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={processing}
            >
              {processing ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-left space-y-3">

            <Link
              href="/"
              className="block text-gray-500 hover:text-gray-700 transition-colors text-sm"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
