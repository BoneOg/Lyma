import { router, Link } from '@inertiajs/react'

export default function StaffDashboard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 text-center">
      <h1 className="text-2xl font-bold text-green-700 mb-6">
        Welcome to the Staff Dashboard
      </h1>

      <div className="space-x-4">
        <button
          onClick={() => router.post('/logout')}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>

        <Link
          href="/"
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
