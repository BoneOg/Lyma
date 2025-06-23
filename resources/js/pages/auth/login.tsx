import { useForm, Link } from '@inertiajs/react'

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-96">
        <h1 className="text-xl font-bold mb-4">Login</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label>Username</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={data.username}
              onChange={e => setData('username', e.target.value)}
            />
            {errors.username && <div className="text-red-500 text-sm">{errors.username}</div>}
          </div>

          <div className="mb-4">
            <label>Password</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded"
              value={data.password}
              onChange={e => setData('password', e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            disabled={processing}
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/register"
            className="text-blue-500 hover:underline block mb-2"
          >
            Don't have an account? Register
          </Link>

          <Link
            href="/"
            className="text-gray-500 hover:underline text-sm"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
