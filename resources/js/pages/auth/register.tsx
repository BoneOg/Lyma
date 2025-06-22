import { useForm } from '@inertiajs/react'
import { Link } from '@inertiajs/react'

export default function Register() {
  const { data, setData, post, processing, errors } = useForm({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: '',
    password_confirmation: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/register')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-96">
        <h1 className="text-xl font-bold mb-4">Register</h1>

        <div className="mb-3">
          <input
            type="text"
            placeholder="First Name"
            value={data.first_name}
            onChange={e => setData('first_name', e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.first_name && <div className="text-red-500 text-sm">{errors.first_name}</div>}
        </div>

        <div className="mb-3">
          <input
            type="text"
            placeholder="Last Name"
            value={data.last_name}
            onChange={e => setData('last_name', e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.last_name && <div className="text-red-500 text-sm">{errors.last_name}</div>}
        </div>

        <div className="mb-3">
          <input
            type="email"
            placeholder="Email"
            value={data.email}
            onChange={e => setData('email', e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
        </div>

        <div className="mb-3">
          <input
            type="text"
            placeholder="Phone Number"
            value={data.phone_number}
            onChange={e => setData('phone_number', e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.phone_number && <div className="text-red-500 text-sm">{errors.phone_number}</div>}
        </div>

        <div className="mb-3">
          <input
            type="password"
            placeholder="Password"
            value={data.password}
            onChange={e => setData('password', e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}
        </div>

        <div className="mb-4">
          <input
            type="password"
            placeholder="Confirm Password"
            value={data.password_confirmation}
            onChange={e => setData('password_confirmation', e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          disabled={processing}
        >
          Register
        </button>

        <div className="text-sm text-center mt-4">
          Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
        </div>
      </form>
    </div>
  )
}
