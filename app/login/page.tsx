import { login } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#f5f6f7',
      }}
    >
      <form
        style={{
          width: 360,
          padding: 32,
          background: '#fff',
          borderRadius: 16,
          display: 'grid',
          gap: 16,
        }}
      >
        <h1>FERASA Operations</h1>
        <p>Authorized personnel only</p>

        {params.error && (
          <p style={{ color: 'red' }}>{params.error}</p>
        )}

        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          style={{ padding: 12 }}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          style={{ padding: 12 }}
        />

        <button
          formAction={login}
          style={{ padding: 12, cursor: 'pointer' }}
        >
          Sign in
        </button>
      </form>
    </main>
  )
}