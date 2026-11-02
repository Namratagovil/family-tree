export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  return (
    <main
      className="flex min-h-screen items-center justify-center p-4"
      style={{ backgroundColor: '#F4F1EA', color: '#111' }}
    >
      <form
        method="POST"
        action="/api/login"
        className="w-full max-w-xl space-y-5 rounded-xl border-4 border-black bg-white p-6"
      >
        <h1 className="text-4xl font-bold">Kunwar Sain Family Tree</h1>
        <label htmlFor="password" className="block text-2xl font-semibold">
          Type the password to continue
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className="w-full rounded-xl border-4 border-black p-4 text-2xl focus-visible:outline-none focus-visible:ring-8 focus-visible:ring-yellow-400"
        />
        {searchParams.error && (
          <p role="alert" className="rounded-xl border-4 border-red-300 bg-red-700 p-3 text-2xl font-bold text-white">
            That password is not right. Please try again.
          </p>
        )}
        <button
          type="submit"
          className="min-h-[4.5rem] w-full rounded-xl border-4 border-black bg-black px-4 text-2xl font-bold text-white focus-visible:outline-none focus-visible:ring-8 focus-visible:ring-yellow-400"
        >
          Open the Family Tree
        </button>
      </form>
    </main>
  )
}
