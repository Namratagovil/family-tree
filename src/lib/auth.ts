export const AUTH_COOKIE = 'family-tree-auth'

// Set APP_PASSWORD in the environment (.env.local locally, project settings when deployed).
// If it is missing, nobody can log in.
export const APP_PASSWORD = process.env.APP_PASSWORD ?? ''

// The cookie holds a hash of the password, never the password itself.
export async function authToken(): Promise<string> {
  const bytes = new TextEncoder().encode(`family-tree:${APP_PASSWORD}`)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('')
}
